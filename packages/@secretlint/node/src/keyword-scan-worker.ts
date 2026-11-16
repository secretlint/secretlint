/**
 * The worker thread that reads files and scans them for the keywords of the rules. See keyword-scan-files.ts
 */
import { parentPort, workerData } from "node:worker_threads";
import { scanFilesInWorker } from "./keyword-scan-files.js";

scanFilesInWorker(workerData, (message, transfer) => parentPort?.postMessage(message, transfer));
