// Add error tracking
export class ErrorTracker {
  private static readonly ERROR_HISTORY_LENGTH = 10;
  private static errors: { [context: string]: { count: number, lastOccurrence: number, messages: string[] } } = {};

  public static track(callback: () => void, context: string): void {
    try {
      callback();
    } catch (error: Error | any) {
      this.logError(context, error);
    }
  }

  private static logError(context: string, error: Error): void {
    if (!this.errors[context]) {
      this.errors[context] = { count: 0, lastOccurrence: 0, messages: [] };
    }

    const errorEntry = this.errors[context];
    errorEntry.count++;
    errorEntry.lastOccurrence = Game.time;

    const errorMessage = `${error.stack || error.message}`;
    errorEntry.messages.unshift(errorMessage);

    if (errorEntry.messages.length > this.ERROR_HISTORY_LENGTH) {
      errorEntry.messages.pop();
    }

    console.log(`Error in ${context} (occurrence #${errorEntry.count}): ${errorMessage}`);

    // Only notify if error hasn't occurred in last 100 ticks
    if (errorEntry.count === 1 || Game.time - errorEntry.lastOccurrence > 100) {
      Game.notify(`Error in ${context}: ${errorMessage}`, 30);
    }
  }

  public static getStats(): void {
    for (const [context, data] of Object.entries(this.errors)) {
      console.log(`Context: ${context}
                Total Errors: ${data.count}
                Last Occurrence: ${Game.time - data.lastOccurrence} ticks ago
                Recent Messages: ${data.messages.slice(0, 3).join('\n')}`);
    }
  }
}
