export type SecretLintProfilerMarker =
    // cli
    | {
          type: "secretlint>cli::start";
      }
    | {
          type: "secretlint>cli::end";
      }
    | {
          type: "secretlint>search-files::start";
      }
    | {
          type: "secretlint>search-files::end";
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

/**
 * A span is the time between `{span}::start` and `{span}::end`.
 */
type SpanOfMarker<T> = T extends { type: `${infer Span}::start` } ? Span : never;
type SecretLintProfilerMarkedSpanType = SpanOfMarker<SecretLintProfilerMarker>;
/**
 * The types of what the profiler records.
 *
 * The types of `mark()` and the types that are recorded with `record()` and `count()`,
 * because they run too many times to create a marker object for each:
 *
 * - "@node>read-file": read a file and decide if it is text or binary
 * - "@core>keyword-scan": scan the content once for the keywords of all rules. It is shared by all rules
 * - "@core>line-check": check the lines that have a keyword with the patterns, before decoding the whole content.
 *    It includes "@core>pattern-line-test"
 * - "@core>pattern-line-test": test a line with a pattern, in "@core>line-check". `id` is the id of the pattern
 * - "@core>pattern": run a pattern on the content or a line and report the matches. `id` is the id of the pattern
 * - "@core>pattern-match": the number of the matches of a pattern. It has no duration. `id` is the id of the pattern
 */
export type SecretLintProfilerStatType =
    | SecretLintProfilerMarkedSpanType
    | "@node>read-file"
    | "@core>keyword-scan"
    | "@core>line-check"
    | "@core>pattern-line-test"
    | "@core>pattern"
    | "@core>pattern-match";
/**
 * The total of the records of a type and an id
 */
export type SecretLintProfilerStat = {
    type: SecretLintProfilerStatType;
    /**
     * The id of the target: a file path, a rule id, or the id of a pattern.
     * undefined if the type has no target.
     */
    id: string | undefined;
    /**
     * How many times it is recorded
     */
    count: number;
    /**
     * The total time in milliseconds
     */
    duration: number;
    /**
     * The longest time of a record in milliseconds
     */
    maxDuration: number;
};
export type SecretLintProfilerOptions = {
    /**
     * Return the current time in milliseconds, like `performance.now()`
     */
    now: () => number;
    /**
     * If `enabled` is `false`, the profiler does not do anything.
     * Profiling costs performance, so it is opt-in.
     * Default: false
     */
    enabled?: boolean;
};

type MutableStat = { count: number; duration: number; maxDuration: number };
const NO_ID = "";

/**
 * The profiler keeps only the totals for each type and id: the count and the time.
 * It does not keep each record, because the core records for each file and each pattern.
 * https://github.com/secretlint/secretlint/issues/1633
 */
export class SecretLintProfiler {
    private nowFn: () => number;
    private enabled: boolean;
    /**
     * type -> id -> total. The id of a type without a target is ""
     */
    private stats: Map<SecretLintProfilerStatType, Map<string, MutableStat>> = new Map();
    /**
     * The start time of the spans that are started by `mark()` and not ended yet
     */
    private startTimes: Map<string, number> = new Map();

    constructor(options: SecretLintProfilerOptions) {
        this.nowFn = options.now;
        this.enabled = options.enabled ?? false;
    }

    get isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * Enable or Disable the profiler.
     * If the profiler is disabled, it records nothing and the collected totals are cleared.
     * @param enabled
     */
    setEnabled(enabled: boolean) {
        if (this.enabled === enabled) {
            return;
        }
        this.enabled = enabled;
        if (!enabled) {
            this.stats.clear();
            this.startTimes.clear();
        }
    }

    private statOf(type: SecretLintProfilerStatType, id: string | undefined): MutableStat {
        let statsOfType = this.stats.get(type);
        if (!statsOfType) {
            statsOfType = new Map();
            this.stats.set(type, statsOfType);
        }
        const key = id ?? NO_ID;
        let stat = statsOfType.get(key);
        if (!stat) {
            stat = { count: 0, duration: 0, maxDuration: 0 };
            statsOfType.set(key, stat);
        }
        return stat;
    }

    /**
     * Mark the start or the end of a span: `{span}::start` and `{span}::end`.
     * The time between the start and the end is recorded for the span and the id.
     * `::end` without `::start` is ignored.
     * A span is found by its type and id, so the spans of the same type and id should not overlap.
     * Use `now()` and `record()` for the code that can run again before it ends.
     */
    mark(marker: SecretLintProfilerMarker) {
        if (!this.enabled) {
            return;
        }
        const now = this.nowFn();
        const id = "id" in marker ? marker.id : undefined;
        const isStart = marker.type.endsWith("::start");
        const span = marker.type.slice(0, isStart ? -"::start".length : -"::end".length);
        const name = id === undefined ? span : `${span}||${id}`;
        if (isStart) {
            this.startTimes.set(name, now);
            return;
        }
        const startTime = this.startTimes.get(name);
        if (startTime === undefined) {
            return;
        }
        this.startTimes.delete(name);
        this.add(span as SecretLintProfilerStatType, id, now - startTime);
    }

    /**
     * Return the current time for `record()`. It is 0 if the profiler is disabled.
     */
    now(): number {
        return this.enabled ? this.nowFn() : 0;
    }

    /**
     * Record the time from `startTime` to now. `startTime` is the result of `now()`.
     * It is for code that runs many times: check `isEnabled` first, and call `now()` and `record()` only if it is true.
     */
    record(type: SecretLintProfilerStatType, id: string | undefined, startTime: number) {
        if (!this.enabled) {
            return;
        }
        this.add(type, id, this.nowFn() - startTime);
    }

    /**
     * Count something that has no duration
     */
    count(type: SecretLintProfilerStatType, id: string | undefined, count: number = 1) {
        if (!this.enabled) {
            return;
        }
        this.statOf(type, id).count += count;
    }

    private add(type: SecretLintProfilerStatType, id: string | undefined, duration: number) {
        const stat = this.statOf(type, id);
        stat.count++;
        stat.duration += duration;
        if (duration > stat.maxDuration) {
            stat.maxDuration = duration;
        }
    }

    /**
     * Return the totals for each type and id, in the order of the first record
     */
    getStats(): SecretLintProfilerStat[] {
        const results: SecretLintProfilerStat[] = [];
        for (const [type, statsOfType] of this.stats) {
            for (const [id, stat] of statsOfType) {
                results.push({ type, id: id === NO_ID ? undefined : id, ...stat });
            }
        }
        return results;
    }
}
