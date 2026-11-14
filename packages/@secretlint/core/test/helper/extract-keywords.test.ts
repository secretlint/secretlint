import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractKeywords } from "../../src/helper/extract-keywords.js";
import { builtinRules } from "../../src/builtin/index.js";

describe("extractKeywords", () => {
    const cases: [RegExp, string[] | undefined][] = [
        [/AKIA[0-9A-Z]{16}/, ["AKIA"]],
        [/password\s*=\s*(?<password>[\w!@#]{1,256})\b.*/u, ["password"]],
        [/PASSWORD\s*=/i, ["password"]],
        [/(ghp|gho|ghs)_[A-Za-z0-9]{36}/, ["ghp", "gho", "ghs"]],
        [/BEGIN (RSA |EC )?PRIVATE KEY/, ["PRIVATE KEY"]],
        [/a(bc)?def/, ["def"]],
        [/se?cret/, ["cret"]],
        [/abc+def/, ["abc"]],
        [/\x41BCD/, ["BCD"]],
        [/(?=.*token)abc/, ["token"]],
        [/tok(?!en)xyz/, ["tok"]],
        [/hooks\.slack\.com\//, ["hooks.slack.com/"]],
        [/[0-9a-f]{64}/, undefined],
        [/(?:foo|ba)x/, undefined],
        [/ab|cdef/, undefined],
        [/.*/, undefined],
        [/(?<!\p{L})ab/u, undefined],
        [/tökén/, undefined],
        [/abc/v, undefined],
    ];
    for (const [regex, expected] of cases) {
        it(`${regex} -> ${JSON.stringify(expected)}`, () => {
            assert.deepStrictEqual(extractKeywords(regex), expected);
        });
    }
    it("finds keywords in every pattern of the built-in rules, and every match of the snapshot inputs contains one", () => {
        const snapshotDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), "../builtin/rules");
        const inputs: string[] = [];
        const walk = (directory: string) => {
            for (const dirent of fs.readdirSync(directory, { withFileTypes: true })) {
                const filePath = path.join(directory, dirent.name);
                if (dirent.isDirectory()) {
                    walk(filePath);
                } else if (dirent.name.startsWith("input")) {
                    inputs.push(fs.readFileSync(filePath, "latin1"));
                }
            }
        };
        walk(snapshotDirectory);
        for (const rule of builtinRules) {
            for (const pattern of rule.patterns ?? []) {
                const keywords = extractKeywords(pattern.pattern);
                assert.ok(keywords, `no keyword: ${pattern.pattern}`);
                const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags.replace("g", "") + "g");
                for (const input of inputs) {
                    const lowerInput = input.toLowerCase();
                    for (const match of input.matchAll(regex)) {
                        assert.ok(
                            keywords.some((keyword) => lowerInput.includes(keyword.toLowerCase())),
                            `${pattern.pattern} matched ${JSON.stringify(match[0])} without ${JSON.stringify(keywords)}`,
                        );
                    }
                }
            }
        }
    });
    it("does not return a keyword that a match of a random pattern does not contain", () => {
        // A small grammar of patterns and texts. A wrong keyword makes a pattern miss a match.
        // mulberry32: a small random number generator with a seed, so that a failure can be reproduced
        let seed = 1;
        const random = (n: number) => {
            seed = (seed + 0x6d2b79f5) | 0;
            let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return Math.floor((((t ^ (t >>> 14)) >>> 0) / 4294967296) * n);
        };
        const pick = (text: string) => text[random(text.length)] as string;
        const alphabet = "abck-_";
        const atom = (depth: number): string => {
            const r = random(10);
            if (r < 5) return pick(alphabet);
            if (r === 5) return "[ab]";
            if (r === 6) return ".";
            if (r === 7 && depth < 3) return `(${sequence(depth + 1)}${random(2) ? `|${sequence(depth + 1)}` : ""})`;
            if (r === 8 && depth < 3) {
                return `${["(?=", "(?!", "(?<=", "(?<!", "(?:"][random(5)]}${sequence(depth + 1)})`;
            }
            return `\\${pick("-_")}`;
        };
        const sequence = (depth: number): string => {
            let text = "";
            const length = 1 + random(6);
            for (let i = 0; i < length; i++) {
                text += atom(depth);
                if (random(4) === 0) text += ["?", "*", "+", "{0,2}", "{2}", "{1,}"][random(6)];
            }
            return text;
        };
        let checked = 0;
        for (let i = 0; i < 5000; i++) {
            const source = sequence(0) + (random(5) === 0 ? `|${sequence(0)}` : "");
            let regex: RegExp;
            try {
                regex = new RegExp(source, ["", "i", "iu", "u"][random(4)]);
            } catch {
                continue;
            }
            const keywords = extractKeywords(regex);
            if (!keywords) continue;
            checked++;
            for (let j = 0; j < 100; j++) {
                let text = "";
                const length = random(30);
                for (let k = 0; k < length; k++) text += pick(`${alphabet}AB`);
                if (regex.test(text)) {
                    const lowerText = text.toLowerCase();
                    assert.ok(
                        keywords.some((keyword) => lowerText.includes(keyword.toLowerCase())),
                        `${regex} matched ${JSON.stringify(text)} without ${JSON.stringify(keywords)}`,
                    );
                }
            }
        }
        assert.ok(checked > 100, `only ${checked} patterns had keywords`);
    });
});
