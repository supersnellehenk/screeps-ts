import _ from "lodash";

export class PerformanceMonitor {
  private static readonly HISTORY_LENGTH = 100;
  private static cpuHistory: number[] = [];
  private static startTime: number;
  private static moduleTimings: { [key: string]: number[] } = {};

  public static start(): void {
    this.startTime = Game.cpu.getUsed();
  }

  public static end(): void {
    const cpu = Game.cpu.getUsed() - this.startTime;
    this.cpuHistory.push(cpu);

    if (this.cpuHistory.length > this.HISTORY_LENGTH) {
      this.cpuHistory.shift();
    }
  }

  public static measureModule(moduleName: string, fn: () => void): void {
    const start = Game.cpu.getUsed();
    fn();
    const end = Game.cpu.getUsed();

    if (!this.moduleTimings[moduleName]) {
      this.moduleTimings[moduleName] = [];
    }

    this.moduleTimings[moduleName].push(end - start);

    if (this.moduleTimings[moduleName].length > this.HISTORY_LENGTH) {
      this.moduleTimings[moduleName].shift();
    }
  }

  public static logStats(): void {
    const avg = _.sum(this.cpuHistory) / this.cpuHistory.length;
    const max = _.max(this.cpuHistory) || 0;
    const min = _.min(this.cpuHistory) || 0;

    console.log(`CPU Stats (last ${this.HISTORY_LENGTH} ticks):
            Avg: ${avg.toFixed(2)}
            Max: ${max.toFixed(2)}
            Min: ${min.toFixed(2)}
            Bucket: ${Game.cpu.bucket}`);

    // Log module-specific stats
    for (const [module, timings] of Object.entries(this.moduleTimings)) {
      const moduleAvg = _.sum(timings) / timings.length;
      console.log(`${module} avg CPU: ${moduleAvg.toFixed(2)}`);
    }
  }
}
