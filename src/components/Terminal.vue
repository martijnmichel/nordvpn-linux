<template>
  <div id="terminal-container"></div>
</template>

<script>
import { FitAddon } from "xterm-addon-fit";
export default {
  name: "Terminal",
  created() {
    this.$nextTick(() => {
      const fitAddon = new FitAddon();
      window.term.open(document.getElementById("terminal-container"));
      window.term.loadAddon(fitAddon);
      fitAddon.fit();

      //console.log(window.ptyProcess);

      //window.ptyProcess.write("uname -a\r");
    });
  },
  methods: {}
};
</script>
