import * as fs from "node:fs";
import { BenchmarkInfo, BenchmarkType, CPUBenchmarkResult, fileName } from "./benchmarksCommon.js";
import * as benchmarksLighthouse from "./benchmarksLighthouse.js";
import * as benchmarksSize from "./benchmarksSize.js";
import { FrameworkData, JsonResult, JsonResultData } from "./common.js";
import { stats } from "./stats.js";

export type ResultLightHouse = {
  framework: FrameworkData;
  benchmark: BenchmarkInfo;
  results: benchmarksLighthouse.StartupBenchmarkResult[];
  type: BenchmarkType.STARTUP;
};

export type ResultCPU = {
  framework: FrameworkData;
  benchmark: BenchmarkInfo;
  results: CPUBenchmarkResult[];
  type: BenchmarkType.CPU;
};

export type ResultMem = {
  framework: FrameworkData;
  benchmark: BenchmarkInfo;
  results: number[];
  type: BenchmarkType.MEM;
};

export type ResultSize = {
  framework: FrameworkData;
  benchmark: BenchmarkInfo;
  results: benchmarksSize.SizeBenchmarkResult[];
  type: BenchmarkType.SIZE;
};

export function writeResults(resultDir: string, res: ResultCPU, numElements: number) {
  switch (res.type) {
    case BenchmarkType.CPU:
      createResultFile(
        resultDir,
        { total: res.results.map((r) => Number(r.total.toFixed(1))), 
          script: res.results.map((r) => Number(r.script.toFixed(1))),
          paint: res.results.map((r) => Number(r.paint.toFixed(1))),
         },
        res.framework,
        res.benchmark,
        numElements
      );
      break;
  }
}

function createResultFile(
  resultDir: string,
  data: number[] | { [key: string]: number[] },
  framework: FrameworkData,
  benchmark: BenchmarkInfo,
  numElements: number
) {
  let type = "";
  switch (benchmark.type) {
    case BenchmarkType.CPU:
      type = "cpu";
      break;
  }
  let convertResult = (label: string, data: number[]) => {
    let res = stats(data);
    console.log(`result ${fileName(framework, benchmark, numElements)} ${label} ${JSON.stringify(res)}`);
    return res;
  };
  if (Array.isArray(data)) {
    let result: JsonResult = {
      framework: framework.fullNameWithKeyedAndVersion,
      keyed: framework.keyed,
      benchmark: benchmark.id,
      type: type,
      values: { DEFAULT: convertResult("", data as number[]) },
    };
    fs.writeFileSync(`${resultDir}/${fileName(framework, benchmark, numElements)}`, JSON.stringify(result), {
      encoding: "utf8",
    });
  } else {
    let values: { [k: string]: JsonResultData } = {};
    for (let key of Object.keys(data)) {
      values[key] = convertResult(key, data[key]);
    }
    let result: JsonResult = {
      framework: framework.fullNameWithKeyedAndVersion,
      keyed: framework.keyed,
      benchmark: benchmark.id,
      type: type,
      values,
    };
    fs.writeFileSync(`${resultDir}/${fileName(framework, benchmark, numElements)}`, JSON.stringify(result), {
      encoding: "utf8",
    });
  }
}
