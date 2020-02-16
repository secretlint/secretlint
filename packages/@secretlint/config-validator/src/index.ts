import SecretLintConfigDescriptorValidate from "./SecretLintConfigDescriptor-validation";
import SecretLintConfigDescriptorRuleValidate from "./SecretLintConfigDescriptorRule-validation";
import SecretLintConfigDescriptorRulePresetValidate from "./SecretLintConfigDescriptorRulePreset-validation";

export const validate = (value: any): { ok: true } | { ok: false; error: Error } => {
    try {
        if (!Array.isArray(value.rules)) {
            const error = new Error(`secretlintrc should have required 'rules' property.
            
{
    "rules": [
        {
            "id": "secretlint-rule-example"
        }
    ]
}
`);
            return {
                ok: false,
                error
            };
        }
        SecretLintConfigDescriptorValidate(value);
        for (const rule of value.rules) {
            // validate as preset
            if ("rules" in rule) {
                try {
                    SecretLintConfigDescriptorRulePresetValidate(rule);
                } catch (error) {
                    const errorMessage = error.message.replace(/SecretLintConfigDescriptorRulePreset/g, rule.id);
                    return {
                        ok: false,
                        error: new Error(errorMessage)
                    };
                }
            } else {
                try {
                    SecretLintConfigDescriptorRuleValidate(rule);
                } catch (error) {
                    const errorMessage = error.message.replace(/SecretLintConfigDescriptorRule/g, rule.id);
                    return {
                        ok: false,
                        error: new Error(errorMessage)
                    };
                }
            }
        }
        return {
            ok: true
        };
    } catch (error) {
        // SecretLintConfigDescriptor -> secretlintrc
        const errorMessage = error.message.replace(/SecretLintConfigDescriptor/g, "secretlintrc");
        return {
            ok: false,
            error: new Error(errorMessage)
        };
    }
};
