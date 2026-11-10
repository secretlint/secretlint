/**
 * Worker thread that lints files.
 * The main thread sends a batch of file paths, and the worker sends back the results of the batch.
 * See parallel.ts for the main thread side.
 */
import { parentPort, workerData } from "node:worker_threads";
import { lintFile, loadConfigFromSource } from "./lint-file.js";
import type { WorkerData, WorkerRequest, WorkerResponse } from "./parallel.js";

const { configSource, lintOptions } = workerData as WorkerData;
const port = parentPort;
if (!port) {
    throw new Error("@secretlint/node worker must be run as a worker thread");
}
// Rules can not be sent to a worker thread, so the worker loads the config by itself
const configPromise = loadConfigFromSource(configSource).then((result) => {
    if (!result.ok) {
        throw new Error("Fail to load secretlint config");
    }
    return result.config;
});
// avoid an unhandled rejection before the first request. The request handler reports the error.
configPromise.catch(() => {});

const toErrorMessage = (error: unknown): string => {
    return error instanceof Error ? (error.stack ?? error.message) : String(error);
};

port.on("message", async (request: WorkerRequest) => {
    try {
        const config = await configPromise;
        const results = [];
        for (const filePath of request.filePathList) {
            results.push(await lintFile({ filePath, config, options: lintOptions }));
        }
        // postMessage throws DataCloneError if a result can not be cloned
        port.postMessage({
            type: "result",
            batchId: request.batchId,
            results,
        } satisfies WorkerResponse);
    } catch (error) {
        port.postMessage({
            type: "error",
            batchId: request.batchId,
            message: toErrorMessage(error),
        } satisfies WorkerResponse);
    }
});
