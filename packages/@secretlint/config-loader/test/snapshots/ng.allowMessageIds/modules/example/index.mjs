import rule from "@secretlint/secretlint-rule-internal-test-pure-deps";

export const creator = rule.createCreator({
    messages: {}, // no messages
    meta: {
        id: "example"
    }
});
