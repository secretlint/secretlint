/**
 * Create a clickable link for a terminal that supports hyperlinks (OSC 8).
 * https://gist.github.com/egmontkob/eb114294efbcd5adb1944c9f3cb5feda
 */
const OSC = "\u001B]";
const BEL = "\u0007";

type Env = Record<string, string | undefined>;
type Stream = { isTTY?: boolean };

const parseVersion = (versionString = ""): { major: number; minor: number; patch: number } => {
    if (/^\d{3,4}$/.test(versionString)) {
        // Env var doesn't always use dots. example: 4601 => 46.1.0
        const match = /(\d{1,2})(\d{2})/.exec(versionString) ?? [];
        return {
            major: 0,
            minor: Number.parseInt(match[1], 10),
            patch: Number.parseInt(match[2], 10),
        };
    }
    const versions = versionString.split(".").map((n) => Number.parseInt(n, 10));
    return {
        major: versions[0],
        minor: versions[1],
        patch: versions[2],
    };
};

/**
 * If the user disables colors, the user probably does not want hyperlinks.
 */
const isColorDisabled = ({ env, argv }: { env: Env; argv: string[] }): boolean => {
    if (["--no-color", "--no-colors", "--color=false", "--color=never"].some((flag) => argv.includes(flag))) {
        return true;
    }
    if (env.FORCE_COLOR !== undefined) {
        return env.FORCE_COLOR === "0" || env.FORCE_COLOR === "false";
    }
    return env.TERM === "dumb";
};

/**
 * Detect that the terminal of the stream supports hyperlinks.
 * The detection is based on https://github.com/chalk/supports-hyperlinks
 */
export const supportsHyperlinks = ({
    stream,
    env = process.env,
    argv = process.argv,
    platform = process.platform,
}: {
    stream: Stream | undefined;
    env?: Env;
    argv?: string[];
    platform?: string;
}): boolean => {
    const { CI, CURSOR_TRACE_ID, FORCE_HYPERLINK, NETLIFY, TEAMCITY_VERSION, TERM_PROGRAM, VTE_VERSION, TERM } = env;
    const TERM_PROGRAM_VERSION = env.TERM_PROGRAM_VERSION ?? "";
    if (FORCE_HYPERLINK) {
        return Number.parseInt(FORCE_HYPERLINK, 10) !== 0;
    }
    if (
        ["--no-hyperlink", "--no-hyperlinks", "--hyperlink=false", "--hyperlink=never"].some((flag) =>
            argv.includes(flag),
        )
    ) {
        return false;
    }
    if (["--hyperlink=true", "--hyperlink=always"].some((flag) => argv.includes(flag))) {
        return true;
    }
    // Netlify does not run a TTY
    if (NETLIFY) {
        return true;
    }
    if (isColorDisabled({ env, argv })) {
        return false;
    }
    if (!stream?.isTTY) {
        return false;
    }
    // Windows Terminal
    if ("WT_SESSION" in env) {
        return true;
    }
    if (platform === "win32") {
        return false;
    }
    if (CI || TEAMCITY_VERSION) {
        return false;
    }
    if (TERM_PROGRAM) {
        const version = parseVersion(TERM_PROGRAM_VERSION);
        switch (TERM_PROGRAM) {
            case "iTerm.app":
                return version.major === 3 ? version.minor >= 1 : version.major > 3;
            case "WezTerm":
                // WezTerm packaged by Nix uses their own version scheme.
                if (/^0-unstable-\d{4}-\d{2}-\d{2}$/.test(TERM_PROGRAM_VERSION)) {
                    return TERM_PROGRAM_VERSION.slice("0-unstable-".length) >= "2020-06-20";
                }
                // The version is a date: 20200620
                return version.major >= 20200620;
            case "vscode":
                // Cursor forked VS Code and supports hyperlinks in 0.x.x
                if (CURSOR_TRACE_ID) {
                    return true;
                }
                return version.major > 1 || (version.major === 1 && version.minor >= 72);
            case "ghostty":
            case "zed":
                return true;
        }
    }
    if (VTE_VERSION) {
        // 0.50.0 was supposed to support hyperlinks, but throws a segfault
        if (VTE_VERSION === "0.50.0") {
            return false;
        }
        const version = parseVersion(VTE_VERSION);
        return version.major > 0 || version.minor >= 50;
    }
    return TERM === "alacritty" || TERM === "xterm-kitty";
};

let isStdoutSupported: boolean | undefined;
/**
 * Return the text that links to the url if stdout supports hyperlinks.
 * Otherwise, return the text as is.
 */
export const terminalLink = (text: string, url: string): string => {
    isStdoutSupported ??= supportsHyperlinks({ stream: process.stdout });
    if (!isStdoutSupported) {
        return text;
    }
    return `${OSC}8;;${url}${BEL}${text}${OSC}8;;${BEL}`;
};
