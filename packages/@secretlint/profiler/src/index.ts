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
}>;
export type SecretLintProfilerOptions = {
    perf: Performance;
    PerformanceObserver: LimitedPerformanceObserver;
};

export class SecretLintProfiler {
    private perf: Performance;
    private entries: PerformanceEntry[] = [];
    private measures: PerformanceEntry[] = [];

    private executionPromises: Promise<void>[] = [];

    constructor(options: SecretLintProfilerOptions) {
        this.perf = options.perf;
        const pattern = /(.*?)::end(\|\|.*)?/;
        const observer = new options.PerformanceObserver((items: PerformanceObserverEntryList) => {
            const entries = items.getEntries();
            entries.forEach((entry) => {
                if (entry.entryType === "mark") {
                    const match = entry.name.match(pattern);
                    const endIdentifier = match ? match[1] : undefined;
                    const suffix = match && match[2] ? match[2] : "";
                    // if mark already {mark}::start, measure start to end
                    if (endIdentifier) {
                        const startIdentifier = `${endIdentifier}::start`;
                        this.entries.find((savedEntry) => {
                            return savedEntry.name === startIdentifier;
                        });
                        // create measure
                        if (startIdentifier) {
                            // FIXME: avoid ERR_INVALID_PERFORMANCE_MARK error
                            this.executionPromises.push(
                                Promise.resolve().then(() => {
                                    this.perf.measure(
                                        endIdentifier + suffix,
                                        `${endIdentifier}::start${suffix}`,
                                        `${endIdentifier}::end${suffix}`
                                    );
                                })
                            );
                        }
                    }
                    this.entries.push(entry);
                } else if (entry.entryType === "measure") {
                    this.measures.push(entry);
                }
            });
        });
        observer.observe({ entryTypes: ["mark", "measure"] });
    }

    mark(marker: SecretLintProfilerMarker) {
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
        await this.waifForExecutionPromises();
        return this.entries;
    }

    async getMeasures() {
        await this.waifForExecutionPromises();
        return this.measures;
    }
}
