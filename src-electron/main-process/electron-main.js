import {
  app,
  BrowserWindow,
  nativeTheme,
  nativeImage,
  Tray,
  Menu,
  ipcMain,
  MenuItem,
  ipcRenderer
} from "electron";

//const trayWindow = require("electron-tray-window");
const path = require("path");

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
let contextMenu;

let status;
function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: process.env.NODE_ENV === "production" ? 800 : 1600,
    height: process.env.NODE_ENV === "production" ? 600 : 900,
    useContentSize: true,
    resizable: process.env.NODE_ENV === "production" ? false : true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: QUASAR_NODE_INTEGRATION

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  });

  tray = new Tray(
    nativeImage.createFromPath(
      path.join(__dirname, "../icons/linux-128x128.png.png")
    )
  );
  contextMenu = Menu.buildFromTemplate([
    {
      id: "status",
      label: "Status: Connected to NL #290",
      type: "normal",
      enabled: false
    },
    { label: "Minimize", role: "minimize" },
    { label: "Quit", role: "quit" }
  ]);
  tray.setToolTip("NordVPN");
  tray.setContextMenu(contextMenu);

  tray.on("click", function() {
    tray.popUpContextMenu();
  });

  //if (process.env.NODE_ENV === "production") mainWindow.setMenu(null);

  mainWindow.loadURL(process.env.APP_URL);

  mainWindow.webContents.on("did-finish-load", function() {
    mainWindow.webContents.send("ping");
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    tray = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    tray.destroy();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("ping", event => {
  event.sender.send("ping");
});

ipcMain.on("update:status", (event, data) => {
  let newMenu;

  if (data.status === "Disconnected") {
    newMenu = Menu.buildFromTemplate([
      {
        id: "status",
        type: "normal",
        enabled: false,
        label: data.status
      },
      {
        label: "Quick connect",
        type: "normal",
        click: (item, window, event) => {
          mainWindow.webContents.send("terminal:command", "connect");
        }
      },
      {
        type: "separator"
      },
      { label: "Minimize", role: "minimize" },
      { label: "Quit", role: "quit" }
    ]);
  } else {
    newMenu = Menu.buildFromTemplate([
      {
        id: "status",
        type: "normal",
        enabled: false,
        label: `${data.status} to ${data.city}, ${data.country}.`
      },
      {
        id: "server",
        type: "normal",
        enabled: false,
        label: "Server: " + data["current server"]
      },
      {
        id: "ip",
        type: "normal",
        enabled: false,
        label: "Your IP: " + data[`your new ip`]
      },
      {
        type: "separator"
      },
      {
        label: "Disconnect",
        type: "normal",
        click: (item, window, event) => {
          mainWindow.webContents.send("terminal:command", "disconnect");
        }
      },
      {
        type: "separator"
      },
      { label: "Minimize", role: "minimize" },
      { label: "Quit", role: "quit" }
    ]);
  }

  tray.setContextMenu(newMenu);
});
