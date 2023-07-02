export const isAggregationError = (error: Error): error is AggregationError => {
    return error instanceof AggregationError;
};
export class AggregationError extends Error {
    errors: Error[];

    constructor(errors: Error[], message: string) {
        // join error operated ----
        const joinedErrorMessage = errors.map((error) => error.message).join("\n\n----\n\n");
        super(message + "\n\n----\n\n" + joinedErrorMessage);
        this.errors = errors;
    }
}
