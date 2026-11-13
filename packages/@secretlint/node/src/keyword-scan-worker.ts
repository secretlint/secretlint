/**
 * The worker thread that scans files for the keywords of the rules. See keyword-scan-files.ts
 */
import { parentPort, workerData } from "node:worker_threads";
import { scanFilesForKeywords } from "./keyword-scan-files.js";

const result = scanFilesForKeywords(workerData);
parentPort?.postMessage(result);
