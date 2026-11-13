import perf_hooks from "node:perf_hooks";

type Performance = typeof perf_hooks.performance | typeof performance;

export type SecretLintProfilerMarker =
    // cli
    | {
          type: "secretlint>cli::start";
      }
    | {
          type: "secretlint>cli::end";
      }
    // config-loader
    | {
          type: "@config-loader>load-packages::start";
      }
    | {
          type: "@config-loader>load-packages::end";
      }
    | {
          type: "@config-loader>load-config-file::start";
      }
    | {
          type: "@config-loader>load-config-file::end";
      }
    | {
          type: "@config-loader>resolve-module::start";
          id: string;
      }
    | {
          type: "@config-loader>resolve-module::end";
          id: string;
      }
    | {
          type: "@config-loader>resolve-modules::start";
      }
    | {
          type: "@config-loader>resolve-modules::end";
      }
    // node
    | {
          type: "@node>load-config::start";
      }
    | {
          type: "@node>load-config::end";
      }
    | {
          type: "@node>execute::start";
      }
    | {
          type: "@node>execute::end";
      }
    | {
          type: "@node>format::start";
      }
    | {
          type: "@node>format::end";
      }
    // core
    | {
          type: "@core>lint::start";
          id: string;
      }
    | {
          type: "@core>lint::end";
          id: string;
      }
    | {
          type: "@core>setup-rules::start";
      }
    | {
          type: "@core>setup-rules::end";
      }
    | {
          type: "@core>setup-rule::start";
          id: string;
      }
    | {
          type: "@core>setup-rule::end";
          id: string;
      }
    | {
          type: "@core>rule-handler::start";
          id: string;
      }
    | {
          type: "@core>rule-handler::end";
          id: string;
      };

export type Constructor<I> = {
    new (...args: any[]): I;
};
export type LimitedPerformanceObserver = Constructor<{
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/PerformanceObserver/disconnect) */
    disconnect(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/PerformanceObserver/observe) */
    observe(options?: any): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/PerformanceObserver/takeRecords) */
    takeRecords?(): PerformanceEntry[];
}>;
export type SecretLintProfilerOptions = {
    perf: Performance;
    PerformanceObserver: LimitedPerformanceObserver;
    /**
     * If `enabled` is `false`, the profiler does not do anything.
     * `mark()` becomes no-op and `PerformanceObserver` is not started.
     * Profiling costs performance, so it is opt-in.
     * Default: false
     */
    enabled?: boolean;
};

export class SecretLintProfiler {
    private perf: Performance;
    private PerformanceObserver: LimitedPerformanceObserver;
    private observer: InstanceType<LimitedPerformanceObserver> | undefined;
    /**
     * Profiling costs performance.
     * `performance.mark()` and `PerformanceObserver` callback are called for each rule and each file.
     * So, the profiler should be disabled if the user does not need the profiling result.
     * https://github.com/secretlint/secretlint/issues/1633
     */
    private enabled: boolean;
    private entries: PerformanceEntry[] = [];
    private measures: PerformanceEntry[] = [];
    /**
     * Set of mark names that have already been marked as `{mark}::start`
     */
    private startMarkNames: Set<string> = new Set();

    private executionPromises: Promise<void>[] = [];

    constructor(options: SecretLintProfilerOptions) {
        this.perf = options.perf;
        this.PerformanceObserver = options.PerformanceObserver;
        this.enabled = options.enabled ?? false;
    }

    get isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * Enable or Disable the profiler.
     * If the profiler is disabled, `mark()` does nothing and collected entries are cleared.
     * @param enabled
     */
    setEnabled(enabled: boolean) {
        if (this.enabled === enabled) {
            return;
        }
        this.enabled = enabled;
        if (!enabled) {
            this.stopObserving();
        }
    }

    private startObserving() {
        const observer = new this.PerformanceObserver((items: PerformanceObserverEntryList) => {
            this.handleEntries(items.getEntries());
        });
        observer.observe({ entryTypes: ["mark", "measure"] });
        this.observer = observer;
    }

    private handleEntries(entries: PerformanceEntry[]) {
        if (!this.enabled) {
            return;
        }
        const pattern = /(.*?)::end(\|\|.*)?/;
        entries.forEach((entry) => {
            if (entry.entryType === "mark") {
                const match = entry.name.match(pattern);
                const endIdentifier = match ? match[1] : undefined;
                const suffix = match && match[2] ? match[2] : "";
                // if mark already {mark}::start, measure start to end
                if (endIdentifier) {
                    const startMarkName = `${endIdentifier}::start${suffix}`;
                    // create measure only when the paired `{mark}::start` is already marked
                    if (this.startMarkNames.has(startMarkName)) {
                        // FIXME: avoid ERR_INVALID_PERFORMANCE_MARK error
                        this.executionPromises.push(
                            Promise.resolve().then(() => {
                                this.perf.measure(endIdentifier + suffix, startMarkName, entry.name);
                            }),
                        );
                    }
                } else {
                    this.startMarkNames.add(entry.name);
                }
                this.entries.push(entry);
            } else if (entry.entryType === "measure") {
                this.measures.push(entry);
            }
        });
    }

    /**
     * PerformanceObserver delivers entries asynchronously.
     * Take the entries that are not delivered yet, so that the result includes marks made just before.
     */
    private flushObserver() {
        const records = this.observer?.takeRecords?.();
        if (records && records.length > 0) {
            this.handleEntries(records);
        }
    }

    private stopObserving() {
        this.observer?.disconnect();
        this.observer = undefined;
        this.entries.length = 0;
        this.measures.length = 0;
        this.executionPromises.length = 0;
        this.startMarkNames.clear();
    }

    mark(marker: SecretLintProfilerMarker) {
        if (!this.enabled) {
            return;
        }
        // Start observing lazily
        // It avoids to start PerformanceObserver when the profiler is disabled before the first mark
        if (!this.observer) {
            this.startObserving();
        }
        if ("id" in marker) {
            this.perf.mark(`${marker.type}||${marker.id}`);
        } else {
            this.perf.mark(marker.type);
        }
    }

    private waifForExecutionPromises = () => {
        return Promise.all(this.executionPromises).finally(() => {
            this.executionPromises.length = 0;
        });
    };

    async getEntries() {
        this.flushObserver();
        await this.waifForExecutionPromises();
        return this.entries;
    }

    async getMeasures() {
        this.flushObserver();
        await this.waifForExecutionPromises();
        // measures created by the marks above
        this.flushObserver();
        return this.measures;
    }
}
