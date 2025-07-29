import { ErrorTracker } from "./ErrorTracker";
import { MemoryMonitor } from "./MemoryMonitor";
import { PerformanceMonitor } from "./PerformanceMonitor";

function monitoring(): void {
  PerformanceMonitor.logStats();
  ErrorTracker.getStats();
  MemoryMonitor.check();
}

// @ts-ignore
global.monitoring = monitoring;
