export class AggregationError extends Error {
    errors: Error[];

    constructor(errors: Error[], message: string) {
        const detailsMessage = errors.map((error) => error.message).join("\n\n");
        super(message + "\n\n" + detailsMessage);
        this.errors = errors;
    }
}
