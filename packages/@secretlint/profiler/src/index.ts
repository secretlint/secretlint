import perf_hooks from "perf_hooks";

type Performance = typeof perf_hooks.performance | typeof performance;

export type SecretLintProfilerMarker =
    // cli
    | {
          type: "secretlint>cli::start";
      }
    | {
          type: "secretlint>cli::end";
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
export type SecretLintProfilerOptions = {
    perf: Performance;
    PerformanceObserver: any;
};

export class SecretLintProfiler {
    private perf: Performance;
    private entries: PerformanceEntry[] = [];
    private measures: PerformanceEntry[] = [];

    constructor(options: SecretLintProfilerOptions) {
        this.perf = options.perf;
        const pattern = /(.*?)::end(\|\|.*)?/;
        const observer = new options.PerformanceObserver((items: PerformanceObserverEntryList) => {
            const entries = items.getEntries();
            entries.forEach(entry => {
                if (entry.entryType === "mark") {
                    const match = entry.name.match(pattern);
                    const endIdentifier = match ? match[1] : undefined;
                    const suffix = match && match[2] ? match[2] : "";
                    // if mark already {mark}}::start, measure start to end
                    if (endIdentifier) {
                        const startIdentifier = `${endIdentifier}::start`;
                        this.entries.find(savedEntry => {
                            return savedEntry.name === startIdentifier;
                        });
                        // create measure
                        if (startIdentifier) {
                            // FIXME: avoid ERR_INVALID_PERFORMANCE_MARK error
                            setTimeout(() => {
                                this.perf.measure(
                                    endIdentifier + suffix,
                                    `${endIdentifier}::start${suffix}`,
                                    `${endIdentifier}::end${suffix}`
                                );
                            });
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

    getEntries() {
        return this.entries;
    }

    getMeasures() {
        return this.measures;
    }
}
