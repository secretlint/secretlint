import rule from "@secretlint/secretlint-rule-internal-test-pure-deps";

export const creator = rule.createCreator({
    messages: {
        EXAMPLE_MESSAGE: "EXAMPLE_MESSAGE test"
    },
    meta: {
        id: "example"
    }
});
