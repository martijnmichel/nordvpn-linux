// import something here
import "xterm/css/xterm.css";

import os from "os";
const pty = require("node-pty");
//import pty from "node-addon-loader!./pty.node";
import { Terminal } from "xterm";

// "async" is optional
export default async ({ app, router, store, Vue }) => {
  // something to do

  var shell = os.platform() === "win32" ? "powershell.exe" : "bash";

  var ptyProcess = pty.spawn(shell, ["-l"], {
    name: "xterm-color",
    cols: 80,
    rows: 24,
    cwd: process.env.HOME,
    env: process.env
  });

  //Terminal.applyAddon(fit);
  var term = new Terminal({
    cols: 80,
    rows: 24,
    theme: { background: "#efefef", foreground: "#000000" },
    fontSize: 12
  });

  ptyProcess.onData(function(data) {
    term.write(data);
  });
  term.onData(data => {
    ptyProcess.write(data);
  });

  window.term = term;
  window.ptyProcess = ptyProcess;
};
