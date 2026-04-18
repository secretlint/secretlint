// @types/node-forge only declares the top-level `node-forge` module. We import
// individual sub-modules to let the bundler tree-shake unused forge features.
declare module "node-forge/lib/forge.js" {
    import forge = require("node-forge");
    export default forge;
}
declare module "node-forge/lib/pkcs12.js" {
    import { pkcs12 } from "node-forge";
    export = pkcs12;
}
