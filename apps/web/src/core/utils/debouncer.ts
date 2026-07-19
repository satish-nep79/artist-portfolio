export class Debouncer {
    private readonly debounceDurationInMs: number;
    private debounceTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(debounceDurationInMs: number) {
        this.debounceDurationInMs = debounceDurationInMs;
    }

    debounce(callback: () => void): void {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
            callback();
        }, this.    debounceDurationInMs);
    }

}