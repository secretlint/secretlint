/**
 * Validate the shape of the config descriptor (`.secretlintrc`).
 *
 * The error messages are compatible with the validator that was generated from the types with ajv:
 * each error is `{name}{path} {message}`, for example `secretlintrc/rules/0 must have required property 'id'`.
 */
type ValidationError = {
    /**
     * The path to the invalid value, like `/rules/0/id`
     */
    path: string;
    message: string;
};
/**
 * Return the first error of the value. Return `undefined` if the value is valid.
 */
type Validator = (value: unknown, path: string) => ValidationError | undefined;

const isObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null && !Array.isArray(value);
};
const stringValidator: Validator = (value, path) => {
    return typeof value === "string" ? undefined : { path, message: "must be string" };
};
const booleanValidator: Validator = (value, path) => {
    return typeof value === "boolean" ? undefined : { path, message: "must be boolean" };
};
const objectValidator: Validator = (value, path) => {
    return isObject(value) ? undefined : { path, message: "must be object" };
};
const arrayOf = (itemValidator: Validator): Validator => {
    return (value, path) => {
        if (!Array.isArray(value)) {
            return { path, message: "must be array" };
        }
        for (let index = 0; index < value.length; index++) {
            const error = itemValidator(value[index], `${path}/${index}`);
            if (error) {
                return error;
            }
        }
        return undefined;
    };
};
const SEVERITY_LEVELS: unknown[] = ["info", "warning", "error"];
const severityValidator: Validator = (value, path) => {
    if (typeof value !== "string") {
        return { path, message: "must be string" };
    }
    return SEVERITY_LEVELS.includes(value)
        ? undefined
        : { path, message: "must be equal to one of the allowed values" };
};
/**
 * Create a validator of an object.
 * It checks the required properties first, and checks the defined properties in the order of `properties`.
 * A property that is not in `properties` is allowed.
 */
const objectOf = ({
    required,
    properties,
}: {
    required: string[];
    properties: Record<string, Validator>;
}): Validator => {
    return (value, path) => {
        if (!isObject(value)) {
            return { path, message: "must be object" };
        }
        for (const name of required) {
            if (value[name] === undefined) {
                return { path, message: `must have required property '${name}'` };
            }
        }
        for (const [name, propertyValidator] of Object.entries(properties)) {
            if (value[name] === undefined) {
                continue;
            }
            const error = propertyValidator(value[name], `${path}/${name}`);
            if (error) {
                return error;
            }
        }
        return undefined;
    };
};

/**
 * SecretLintConfigDescriptorRule
 */
const ruleValidator = objectOf({
    required: ["id"],
    properties: {
        id: stringValidator,
        options: objectValidator,
        disabled: booleanValidator,
        allowMessageIds: arrayOf(stringValidator),
        severity: severityValidator,
    },
});
/**
 * SecretLintConfigDescriptorRulePreset
 */
const rulePresetValidator = objectOf({
    required: ["id"],
    properties: {
        id: stringValidator,
        options: objectValidator,
        disabled: booleanValidator,
        rules: arrayOf(ruleValidator),
    },
});
/**
 * An item of `rules` is a rule or a preset. Return the errors of both if it is neither.
 */
const validateRuleOrPreset = (value: unknown, path: string): ValidationError[] => {
    const ruleError = ruleValidator(value, path);
    if (!ruleError) {
        return [];
    }
    const presetError = rulePresetValidator(value, path);
    if (!presetError) {
        return [];
    }
    return [ruleError, presetError, { path, message: "must match a schema in anyOf" }];
};
/**
 * SecretLintConfigDescriptor
 */
const validateDescriptor = (value: unknown): ValidationError[] => {
    if (!isObject(value)) {
        return [{ path: "", message: "must be object" }];
    }
    if (value.rules === undefined) {
        return [{ path: "", message: "must have required property 'rules'" }];
    }
    if (value.sharedOptions !== undefined) {
        const error = objectValidator(value.sharedOptions, "/sharedOptions");
        if (error) {
            return [error];
        }
    }
    if (!Array.isArray(value.rules)) {
        return [{ path: "/rules", message: "must be array" }];
    }
    for (let index = 0; index < value.rules.length; index++) {
        const errors = validateRuleOrPreset(value.rules[index], `/rules/${index}`);
        if (errors.length > 0) {
            return errors;
        }
    }
    return [];
};

const throwIfInvalid = (name: string, errors: ValidationError[]): void => {
    if (errors.length === 0) {
        return;
    }
    const error = new Error(
        `Invalid ${name}: ${errors.map((error) => `${name}${error.path} ${error.message}`).join(", ")}`,
    );
    error.name = "ValidationError";
    throw error;
};
const toErrors = (error: ValidationError | undefined): ValidationError[] => {
    return error ? [error] : [];
};

/**
 * Validate that the value is SecretLintConfigDescriptor.
 * @param value
 * @param name the name of the value in the error message
 * @throws ValidationError if the value is invalid
 */
export const validateSecretLintConfigDescriptor = (value: unknown, name: string): void => {
    throwIfInvalid(name, validateDescriptor(value));
};
/**
 * Validate that the value is SecretLintConfigDescriptorRule.
 * @param value
 * @param name the name of the value in the error message
 * @throws ValidationError if the value is invalid
 */
export const validateSecretLintConfigDescriptorRule = (value: unknown, name: string): void => {
    throwIfInvalid(name, toErrors(ruleValidator(value, "")));
};
/**
 * Validate that the value is SecretLintConfigDescriptorRulePreset.
 * @param value
 * @param name the name of the value in the error message
 * @throws ValidationError if the value is invalid
 */
export const validateSecretLintConfigDescriptorRulePreset = (value: unknown, name: string): void => {
    throwIfInvalid(name, toErrors(rulePresetValidator(value, "")));
};
