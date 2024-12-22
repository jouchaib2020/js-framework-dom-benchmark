// import { testTextContains, testTextContainsJS, testTextNotContained, testClassContains, testElementLocatedByXpath, testElementNotLocatedByXPath, testElementLocatedById, clickElementById, clickElementByXPath, getTextByXPath } from './webdriverAccess'

import { Page } from "puppeteer-core";
import {
  BenchmarkType,
  Benchmark,
  memBenchmarkInfos,
  cpuBenchmarkInfos,
  CPUBenchmarkInfo,
  BenchmarkImpl,
  MemBenchmarkInfo,
} from "./benchmarksCommon.js";
import { config, FrameworkData } from "./common.js";
import {
  checkCountForSelector,
  checkElementContainsText,
  checkElementExists,
  checkElementHasClass,
  checkElementNotExists,
  clickElement,
} from "./puppeteerAccess.js";

export abstract class CPUBenchmarkPuppeteer implements BenchmarkImpl {
  type = BenchmarkType.CPU;
  constructor(public benchmarkInfo: CPUBenchmarkInfo) {}
  abstract init(page: Page, framework: FrameworkData): Promise<any>;
  abstract run(page: Page, framework: FrameworkData): Promise<any>;
}

export abstract class MemBenchmarkPuppeteer implements BenchmarkImpl {
  type = BenchmarkType.MEM;
  constructor(public benchmarkInfo: MemBenchmarkInfo) {}
  abstract init(page: Page, framework: FrameworkData): Promise<any>;
  abstract run(page: Page, framework: FrameworkData): Promise<any>;
}

export type BenchmarkPuppeteer = CPUBenchmarkPuppeteer | MemBenchmarkPuppeteer;

export let benchRun = new (class extends CPUBenchmarkPuppeteer {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._01]);
  }

  N= 10;
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    for (let i = 0; i < this.benchmarkInfo.warmupCount; i++) {
      await clickElement(page, "pierce/#run");
      await clickElement(page, "pierce/#clear");
      await checkElementNotExists(page, ".tree-container > .node");
    }
  }

  async run(page: Page) {
    await clickElement(page, "pierce/#run");
    await checkCountForSelector(page, ".tree-container .node", Math.pow(2, this.N) - 1);
  }
})();


export const benchReplaceAll = new (class extends CPUBenchmarkPuppeteer {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._02]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    for (let i = 0; i < this.benchmarkInfo.warmupCount; i++) {
      await clickElement(page, "pierce/#run");
      // await checkElementContainsText(
      //   page,
      //   "pierce/tbody>tr:nth-of-type(1)>td:nth-of-type(1)",
      //   (i * 1000 + 1).toFixed()
      // );
    }
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#run");
    await checkCountForSelector(page, ".tree-container .node", 1023);
  }
})();

export const benchUpdate = new (class extends CPUBenchmarkPuppeteer {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._03]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    await clickElement(page, "pierce/#run");
    // await checkElementExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
    for (let i = 0; i < this.benchmarkInfo.warmupCount; i++) {
      await clickElement(page, "pierce/#update");
      await checkElementContainsText(
        page,
        "pierce/.tree-container>.node",
        "!!!"
      );
    }
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#update");
    await checkElementContainsText(
      page,
      ".tree-container .node",
      "!!!"
    );
  }
})();

export const benchSelect = new (class extends CPUBenchmarkPuppeteer {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._04]);
  }

  async init(page: Page) {
    // Wait for the "run" button and click it to build the tree
    await checkElementExists(page, "pierce/#run");
    await clickElement(page, "pierce/#run");

    // Warmup: repeatedly select different nodes by nth-of-type
    // and verify that only the clicked node gains the "selected" class
    for (let i = 0; i <= this.benchmarkInfo.warmupCount; i++) {
      const nodeIndex = i + 5; // Just an example offset for warmup
      await clickElement(page, `pierce/.tree-container ${" .node:nth-child(1)".repeat(nodeIndex)} .node-label a`);
      await checkElementHasClass(page, `pierce/.tree-container ${" .node:nth-child(1)".repeat(nodeIndex)}`, "selected");
      await checkCountForSelector(page, "pierce/.tree-container .node.selected", 1);
    }
  }

  async run(page: Page) {
    // Actual run: select a different node, check the class, and ensure only one node is selected
    await clickElement(page, `pierce/.tree-container ${" .node:nth-child(2)".repeat(2)} .node-label a`);
    await checkElementHasClass(page,`pierce/.tree-container ${" .node:nth-child(2)".repeat(2)}`, "selected");
  }
})();


export const benchSwapRows = new (class extends CPUBenchmarkPuppeteer {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._05]);
  }
  public leafdepth = 9;
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    await clickElement(page, "pierce/#run");
    // await checkElementExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
    for (let i = 0; i <= this.benchmarkInfo.warmupCount; i++) {
      // 11 if even, 10 if odd
      let idAsText = i % 2 == 0 ? this.leafdepth + 2 : this.leafdepth + 1;
      await clickElement(page, "pierce/#swaprows");
      await checkElementContainsText(page, `pierce/.tree-container ${" .node:nth-child(1)".repeat(9+1)} .node-label a`, idAsText.toString());
    }
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#swaprows");
    const text = this.leafdepth + 2;
    await checkElementContainsText(page, `pierce/.tree-container ${" .node:nth-child(1)".repeat(9+1)} .node-label a`, text.toString());
  }
})();

export const benchRemove = new (class extends CPUBenchmarkPuppeteer {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._06]);
  }
  rowsToSkip = 4;
  depth = 10;
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    await clickElement(page, "pierce/#run");
    await checkElementExists(page,`pierce/.tree-container ${" .node:first-child".repeat(this.depth)} .node-label span`);
    await clickElement(page,`pierce/.tree-container ${" .node:first-child".repeat(this.depth)} .node-label span`);
    await checkElementContainsText( 
      page,
      `pierce/.tree-container ${" .node:first-child".repeat(this.depth)} .node-label a`,
      (this.depth+1).toString()
    );
    await clickElement(page,`pierce/.tree-container ${" .node:first-child".repeat(this.depth)} .node-label span`);
    await checkElementNotExists(page,`pierce/.tree-container ${" .node:first-child".repeat(this.depth)} .node-label span`);
    await clickElement(page, "pierce/#clear");
    await clickElement(page, "pierce/#run");
  }
  async run(page: Page) {
    await clickElement(page,`pierce/.tree-container ${" .node:first-child".repeat(this.depth)} .node-label span`);
    await checkElementContainsText( 
      page,
      `pierce/.tree-container ${" .node:first-child".repeat(this.depth)} .node-label a`,
      (this.depth+1).toString()
    );
  }
})();
export const benchRunBig = new (class extends CPUBenchmarkPuppeteer {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._07]);
  }
  N = 14;
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    for (let i = 0; i < this.benchmarkInfo.warmupCount; i++) {
      await clickElement(page, "pierce/#runlots");
      await clickElement(page, "pierce/#clear");
    }
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#runlots");
    await checkCountForSelector(page, ".tree-container .node", Math.pow(2, this.N) - 1);
  }
})();

export const benchAppendToManyRows = new (class extends CPUBenchmarkPuppeteer {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._08]);
  }
  N = 10;
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    for (let i = 0; i < this.benchmarkInfo.warmupCount; i++) {
      await clickElement(page, "pierce/#run");
      await clickElement(page, "pierce/#clear");
    }
    await clickElement(page, "pierce/#run");
    await checkElementExists(page, ".tree-container .node");
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#add");
    await checkCountForSelector(page, ".tree-container .node", 2*(Math.pow(2, this.N) - 1));
  }
})();

export const benchClear = new (class extends CPUBenchmarkPuppeteer {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._09]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    for (let i = 0; i < this.benchmarkInfo.warmupCount; i++) {
      await clickElement(page, "pierce/#run");
      await clickElement(page, "pierce/#clear");
    }
    await clickElement(page, "pierce/#run");
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#clear");
    await checkElementNotExists(page, ".tree-container .node");
  }
})();

export const benchReadyMemory = new (class extends MemBenchmarkPuppeteer {
  constructor() {
    super(memBenchmarkInfos[Benchmark._21]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
  }
  async run() {
    return await Promise.resolve(null);
  }
})();

export const benchRunMemory = new (class extends MemBenchmarkPuppeteer {
  constructor() {
    super(memBenchmarkInfos[Benchmark._22]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#run");
    await checkElementExists(page, "pierce/tbody>tr:nth-of-type(1)>td:nth-of-type(2)>a");
  }
})();

export const benchRun10KMemory = new (class extends MemBenchmarkPuppeteer {
  constructor() {
    super(memBenchmarkInfos[Benchmark._26]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#runlots");
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#runlots");
    await checkElementExists(page, "pierce/tbody>tr:nth-of-type(10000)>td:nth-of-type(2)>a");
  }
})();

export const benchUpdate5Memory = new (class extends MemBenchmarkPuppeteer {
  constructor() {
    super(memBenchmarkInfos[Benchmark._23]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#run");
    await checkElementExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(2)>a");
    for (let i = 0; i < 5; i++) {
      await clickElement(page, "pierce/#update");
      await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(1)>td:nth-of-type(2)>a", " !!!".repeat(i));
    }
  }
})();

// export const benchReplace5Memory = new (class extends MemBenchmarkPuppeteer {
//   constructor() {
//     super(memBenchmarkInfos[Benchmark._24]);
//   }
//   async init(page: Page) {
//     await checkElementExists(page, "pierce/#run");
//   }
//   async run(page: Page) {
//     for (let i = 0; i < 5; i++) {
//       await clickElement(page, "pierce/#run");
//       await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)", (1000 * (i + 1)).toFixed());
//     }
//   }
// })();

export const benchCreateClear5Memory = new (class extends MemBenchmarkPuppeteer {
  constructor() {
    super(memBenchmarkInfos[Benchmark._25]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
  }
  async run(page: Page) {
    for (let i = 0; i < 5; i++) {
      await clickElement(page, "pierce/#run");
      await checkElementContainsText(
        page,
        "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)",
        (1000 * (i + 1)).toFixed()
      );
      await clickElement(page, "pierce/#clear");
      await checkElementNotExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
    }
  }
})();

export const benchmarks = [
  benchRun,
  benchReplaceAll,
  benchUpdate,
  benchSelect,
  benchSwapRows,
  benchRemove,
  benchRunBig,
  benchAppendToManyRows,
  benchClear,
  benchReadyMemory,
  benchRunMemory,
  benchUpdate5Memory,
  // benchReplace5Memory,
  benchCreateClear5Memory,
  benchRun10KMemory,
];
