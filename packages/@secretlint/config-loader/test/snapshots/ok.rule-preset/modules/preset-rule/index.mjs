import { createCreator } from "@secretlint/secretlint-rule-internal-test-esm";

const rules = [createCreator({
    meta: {
        id: "example"
    }
})];
export const creator = {
    meta: {
        id: "preset-rule",
        recommended: true,
        type: "preset"
    },
    rules,
    create(context, _options) {
        rules.forEach((rule) => {
            context.registerRule(rule);
        });
    }
};
