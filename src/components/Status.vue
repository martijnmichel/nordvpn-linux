<template>
  <div>
    <q-chip v-if="status.status === 'Connected'">
      {{ status.status }} to {{ status.country }}
    </q-chip>
    <q-chip clickable ripple v-else>
      {{ status.status }}
    </q-chip>
    <q-chip
      clickable
      ripple
      @click="disconnect()"
      v-if="status.status === 'Connected'"
      ><q-icon name="close"
    /></q-chip>
  </div>
</template>

<script>
import { exec } from "child_process";
export default {
  name: "Status",
  data() {
    return {
      hover: false,
      interval: undefined
    };
  },
  computed: {
    status() {
      return this.$store.state.status;
    }
  },
  beforeDestroy() {
    this.$root.$off("updateStatus");
  },
  created() {
    this.$root.$on("updateStatus", () => {
      let x = 0;
      this.interval = setInterval(() => {
        x++;
        this.getStatus();
        if (x === 10) clearInterval(this.interval);
      }, 1000);
    });
  },
  mounted() {
    this.getStatus();
  },
  methods: {
    getStatus() {
      exec("nordvpn status", (err, stdout, esterr) => {
        let status = {};
        _.each(stdout.split("\n"), d => {
          if (!d) return false;
          let line = d.split(": ");
          status[line[0].replace(/-/i, "").toLowerCase()] = line[1];
        });
        this.$store.commit("setStatus", status);
      });
    },
    async disconnect() {
      if (this.status.status === "Connected") {
        await window.ptyProcess.write("nordvpn disconnect\r");
        this.getStatus();
      }
    }
  }
};
</script>

<style></style>
