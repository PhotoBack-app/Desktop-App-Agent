import { app, BrowserWindow } from "electron";
import path from "path";
import { createIPCHandler } from "electron-trpc/main";
import mdns from "mdns";
import os from "node:os";

import { setupServer } from "./server/server";
import { router } from "./electron/api";

let closeServer: (() => void) | undefined;

// TODO: generate and store a real uuid on startup
const uuid = "12345678-4321-1234-1234-123456789012";

const hostname = os.hostname().replace(".local", "");
const serverName = `${uuid}*PhotoBackApp on ${hostname}`;

setupServer().then((result) => {
  if (result.status === "success") {
    const { port } = result;
    console.log("Publishing bonjour service");
    const ad = mdns.createAdvertisement(mdns.tcp("photobackapp"), port, {
      name: serverName,
    });
    ad.start();
  }
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  if (closeServer) {
    closeServer();
  }
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  createIPCHandler({ router, windows: [mainWindow] });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }
  mainWindow.reload(); // Makes trpcs S<->C work

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (closeServer) {
      closeServer();
    }
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("before-quit", () => {
  if (closeServer) {
    closeServer();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
