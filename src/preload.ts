// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { exposeElectronTRPC } from "electron-trpc/main";

// process.once("loaded", async () => {
// });
console.log("preload.ts loaded");
exposeElectronTRPC();
