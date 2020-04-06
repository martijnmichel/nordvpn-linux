import {
  app,
  BrowserWindow,
  nativeTheme,
  //nativeImage,
  //Tray,
  //Menu,
} from "electron";

const trayWindow = require("electron-tray-window");

try {
  if (
    process.platform === "win32" &&
    nativeTheme.shouldUseDarkColors === true
  ) {
    require("fs").unlinkSync(
      require("path").join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {}

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = require("path")
    .join(__dirname, "statics")
    .replace(/\\/g, "\\\\");
}

let mainWindow;
let tray;
function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: process.env.NODE_ENV === "production" ? 800 : 1200,
    height: 600,
    useContentSize: true,
    resizable: process.env.NODE_ENV === "production" ? false : true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: QUASAR_NODE_INTEGRATION,

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    },
  });
  /*
  tray = new Tray(nativeImage.createFromPath("../icons/linux-128x128.png.png"));
  let trayContent = new BrowserWindow();
  trayContent.loadURL("https://google.nl");
  const contextMenu = Menu.buildFromTemplate([
    { label: "Item1", type: "radio" },
    { label: "Item2", type: "radio" },
    { label: "Item3", type: "radio", checked: true },
  ]);
  tray.setToolTip("This is my application.");
  trayWindow.setOptions({ tray: tray, window: trayContent });

  /*
  trayWindow.setOptions({
    trayIconPath: nativeImage.createFromPath("../icons/linux-128x128.png.png"),
    windowUrl: "./tray.html",
  });
*/
  //if (process.env.NODE_ENV === "production") mainWindow.setMenu(null);

  mainWindow.loadURL(process.env.APP_URL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
