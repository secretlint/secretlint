export type WalkOptions = {
    cwd: string;
    patterns?: string[];
    ignoreFiles?: string[];
    extraIgnorePatterns?: string[];
    noGlob?: boolean;
};

export const walk = async (_options: WalkOptions): Promise<string[]> => {
    throw new Error("not implemented");
};
