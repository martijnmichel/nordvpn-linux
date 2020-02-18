<template>
  <div id="terminal-container"></div>
</template>

<script>
const { exec } = require("child_process");
import _ from "lodash";
import "xterm/css/xterm.css";
var Terminal = require("xterm").Terminal;
import { FitAddon } from "xterm-addon-fit";
//var fit = require('xterm/build/addons/fit/fit');
var os = require("os");
var pty = require("node-pty");

var shell = os.platform() === "win32" ? "powershell.exe" : "bash";

export default {
  name: "Terminal",
  created() {
    this.$nextTick(() => {
      var ptyProcess = pty.spawn(shell, [], {
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
        theme: { background: "#efefef", foreground: "#000000" }
      });
      const fitAddon = new FitAddon();
      term.open(document.getElementById("terminal-container"));
      term.loadAddon(fitAddon);
      fitAddon.fit();

      function buf() {
        let s = "";
        let sender = null;
        return data => {
          s += data;
          if (!sender) {
            sender = setTimeout(() => {
              term.write(s);
              s = "";
              sender = null;
            }, 30);
          }
        };
      }

      const send = buf();

      ptyProcess.on("data", function(data) {
        term.write(data);
        // send(data);
      });
      term.onData(data => ptyProcess.write(data));
      /*
      term._core.register(
        term.addDisposableListener("data", ptyProcess.write.bind(ptyProcess))
      );
      
      term.on("resize", function(size) {
        ptyProcess.resize(size.cols, size.rows);
      });
      window.onresize = function() {
        term.fit();
      };
      
      term._core.register(
        term.addDisposableListener("paste", function(data, ev) {
          term.write(data);
        })
      );
      

      term.on("title", title => {
        document.title = title;
      });
      */

      //term.fit();
      //term.focus();

      window.term = term;
      window.ptyProcess = ptyProcess;
    });
  },
  methods: {}
};
</script>
