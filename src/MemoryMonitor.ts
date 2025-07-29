// Enhanced memory monitoring
export class MemoryMonitor {
  private static readonly WARNING_THRESHOLD = 1.8 * 1024 * 1024; // 1.8MB
  private static readonly CRITICAL_THRESHOLD = 1.9 * 1024 * 1024; // 1.9MB
  private static lastNotification = 0;

  public static check(): void {
    const size = RawMemory.get().length;
    const sizeInMB = size / 1024 / 1024;

    if (size > this.CRITICAL_THRESHOLD) {
      if (Game.time - this.lastNotification > 100) {
        Game.notify(`CRITICAL: Memory usage at ${sizeInMB.toFixed(2)}MB!`, 30);
        this.lastNotification = Game.time;
      }
      console.log(`CRITICAL: Memory usage at ${sizeInMB.toFixed(2)}MB!`);
      this.emergencyCleanup();
    } else if (size > this.WARNING_THRESHOLD) {
      console.log(`WARNING: Memory usage high (${sizeInMB.toFixed(2)}MB)`);
    }
  }

  private static emergencyCleanup(): void {
    // Add your emergency memory cleanup logic here
    // For example:
    // delete Memory.stats;  // Clear statistics
    // Clear any debug or temporary data
    // if (Memory.tmp) delete Memory.tmp;
  }
}
