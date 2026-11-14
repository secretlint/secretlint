// The worker thread of @secretlint/node that scans files for the keywords of the rules.
// @secretlint/node starts "./keyword-scan-worker.js" next to its own file,
// so this file is an entry of the binary with the same name, next to the main entry.
import "@secretlint/node/keyword-scan-worker";
