import { Browser, Page } from "puppeteer-core";
import { BenchmarkType, CPUBenchmarkResult, slowDownFactor } from "./benchmarksCommon.js";
import { CPUBenchmarkPuppeteer, BenchmarkPuppeteer, benchmarks } from "./benchmarksPuppeteer.js";
import {
  BenchmarkOptions,
  config as defaultConfig,
  ErrorAndWarning,
  FrameworkData,
  Config,
  wait,
} from "./common.js";
import { startBrowser } from "./puppeteerAccess.js";
import { computeResultsCPU, computeResultsJS, computeResultsPaint, fileNameTrace } from "./timeline.js";
import * as fs from "node:fs";

let config: Config = defaultConfig;

async function runBenchmark(page: Page, benchmark: BenchmarkPuppeteer, framework: FrameworkData, numElements: number): Promise<any> {
  await benchmark.run(page, numElements, framework);
  if (config.LOG_PROGRESS) console.log("after run", benchmark.benchmarkInfo.id, benchmark.type, framework.name);
}

async function initBenchmark(page: Page, benchmark: BenchmarkPuppeteer, framework: FrameworkData, numElements: number): Promise<any> {
  await benchmark.init(page, numElements, framework);
  if (config.LOG_PROGRESS) console.log("after initialized", benchmark.benchmarkInfo.id, benchmark.type, framework.name);
}

function convertError(error: any): string {
  console.log(
    "ERROR in run Benchmark: |",
    error,
    "| type:",
    typeof error,
    "instance of Error",
    error instanceof Error,
    "Message:",
    error.message
  );
  if (typeof error === "string") {
    console.log("Error is string");
    return error;
  } else if (error instanceof Error) {
    console.log("Error is instanceof Error");
    return error.message;
  } else {
    console.log("Error is unknown type");
    return error.toString();
  }
}

async function forceGC(page: Page) {
  await page.evaluate("window.gc({type:'major',execution:'sync',flavor:'last-resort'})");
}

async function runCPUBenchmark(
  framework: FrameworkData,
  benchmark: CPUBenchmarkPuppeteer,
  benchmarkOptions: BenchmarkOptions,
  numElements: number
): Promise<ErrorAndWarning<CPUBenchmarkResult>> {
  let warnings: string[] = [];
  let results: CPUBenchmarkResult[] = [];

  console.log("benchmarking", framework, benchmark.benchmarkInfo.id);
  let browser: Browser = null;

  try {
    browser = await startBrowser(benchmarkOptions);
    for (let i = 0; i < 2; i++) {
      const page = await browser.newPage();
      page.on("console", (msg) => console.log("BROWSER:", ...msg.args()));
      try {
        await page.goto(`http://${benchmarkOptions.host}:${benchmarkOptions.port}/${framework.uri}/index.html`, {
          waitUntil: "networkidle0",
        });
      } catch (error) {
        console.log("**** loading benchmark failed, retrying");
        await page.goto(`http://${benchmarkOptions.host}:${benchmarkOptions.port}/${framework.uri}/index.html`, {
          waitUntil: "networkidle0",
        });
      }

      console.log("initBenchmark");
      await initBenchmark(page, benchmark, framework, numElements);

      let categories = [
        "disabled-by-default-v8.cpu_profiler",
        "blink.user_timing",
        "devtools.timeline",
        "disabled-by-default-devtools.timeline",
      ];

      let throttleCPU = slowDownFactor(benchmark.benchmarkInfo.id, benchmarkOptions.allowThrottling);
      if (throttleCPU) {
        console.log("CPU slowdown", throttleCPU);
        await page.emulateCPUThrottling(throttleCPU);
      }

      await page.tracing.start({
        path: fileNameTrace(framework, benchmark.benchmarkInfo, i, benchmarkOptions, numElements),
        screenshots: false,
        categories: categories,
      });
      await wait(50);

      await forceGC(page);

      console.log("runBenchmark");
      // let m1 = await page.metrics();

      await runBenchmark(page, benchmark, framework, numElements);

      await wait(100);
      await page.tracing.stop();
      // let m2 = await page.metrics();
      if (throttleCPU) {
        await page.emulateCPUThrottling(1);
      }

      // console.log("afterBenchmark", m1, m2);
      // let result = (m2.TaskDuration - m1.TaskDuration)*1000.0; //await computeResultsCPU(fileNameTrace(framework, benchmark, i), benchmarkOptions, framework, benchmark, warnings, benchmarkOptions.batchSize);
      try {
        let result = await computeResultsCPU(fileNameTrace(framework, benchmark.benchmarkInfo, i, benchmarkOptions, numElements));
        let resultScript = await computeResultsJS(
          result,
          config,
          fileNameTrace(framework, benchmark.benchmarkInfo, i, benchmarkOptions, numElements)
        );
        let resultPaint = await computeResultsPaint(
          result,
          config,
          fileNameTrace(framework, benchmark.benchmarkInfo, i, benchmarkOptions, numElements)
        );
        console.log("**** resultScript =", resultScript);
        // if (m2.Timestamp == m1.Timestamp) throw new Error("Page metrics timestamp didn't change");
        results.push({ total: result.duration, script: resultScript, paint: resultPaint });
        console.log(`duration for ${framework.name} and ${benchmark.benchmarkInfo.id}: ${JSON.stringify(result)}`);
        if (result.duration < 0) throw new Error(`duration ${result} < 0`);
      } catch (error) {
        if (error === "exactly one click event is expected") {
          let fileName = fileNameTrace(framework, benchmark.benchmarkInfo, i, benchmarkOptions, numElements);
          let errorFileName = fileName.replace(/\//, "/error-");
          fs.copyFileSync(fileName, errorFileName);
          console.log(
            "*** Repeating run because of 'exactly one click event is expected' error",
            fileName,
            "saved in",
            errorFileName
          );
          i--;

          continue;
        } else {
          console.log("*** Unhandled error:", error);
          throw error;
        }
      } finally {
        await page.close();
      }
    }
    return { error: undefined, warnings, result: results };
  } catch (error) {
    console.log("ERROR", error);
    return { error: convertError(error), warnings };
  } finally {
    try {
      if (browser) {
        console.log("*** browser close");
        await browser.close();
        console.log("*** browser closed");
      }
    } catch (error) {
      console.log("ERROR cleaning up driver", error);
    }
    console.log("*** browser has been shutting down");
  }
}

export async function executeBenchmark(
  framework: FrameworkData,
  benchmarkId: string,
  benchmarkOptions: BenchmarkOptions,
  numElements: number
): Promise<ErrorAndWarning<any>> {
  let runBenchmarks: Array<BenchmarkPuppeteer> = benchmarks.filter(
    (b) =>
      benchmarkId === b.benchmarkInfo.id && (b instanceof CPUBenchmarkPuppeteer)
  ) as Array<BenchmarkPuppeteer>;
  if (runBenchmarks.length != 1) throw `Benchmark name ${benchmarkId} is not unique (puppeteer)`;

  let benchmark = runBenchmarks[0];

  let errorAndWarnings: ErrorAndWarning<any>;
  if (benchmark.type == BenchmarkType.CPU) {
    errorAndWarnings = await runCPUBenchmark(framework, benchmark as CPUBenchmarkPuppeteer, benchmarkOptions, numElements);
  }
  if (config.LOG_DEBUG) console.log("benchmark finished - got errors promise", errorAndWarnings);
  return errorAndWarnings;
}

process.on("message", (msg: any) => {
  config = msg.config;
  console.log("START BENCHMARK. Write results?", config.WRITE_RESULTS);
  // if (config.LOG_DEBUG) console.log("child process got message", msg);

  let {
    framework,
    benchmarkId,
    benchmarkOptions,
    numELements
  }: {
    framework: FrameworkData;
    benchmarkId: string;
    benchmarkOptions: BenchmarkOptions;
    numELements: number
  } = msg;
  defaultConfig.PUPPETEER_WAIT_MS = benchmarkOptions.puppeteerSleep;
  console.log("forked runner using sleep for puppeteer", config.PUPPETEER_WAIT_MS);
  executeBenchmark(framework, benchmarkId, benchmarkOptions, numELements)
    .then((result) => {
      process.send(result);
      process.exit(0);
    })
    .catch((error) => {
      console.log("CATCH: Error in forkedBenchmarkRunner");
      process.send({ error: convertError(error) });
      process.exit(0);
    });
});
