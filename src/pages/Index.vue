<template>
  <q-page class="flex flex-center">
    <q-btn @click="getServers()">Get</q-btn>
    <div class="row">
      <div
        class="col-xs-12"
        v-for="(server, key) in $store.getters['servers']"
        v-bind:key="`server-${key}`"
      >
        {{ server.name }}: {{ server.load }}

        <q-btn @click="connect(server.hostname)">connect</q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
const { exec } = require("child_process");
import _ from "lodash";
export default {
  name: "PageIndex",
  created() {},
  methods: {
    connect(hostname) {
      exec(`nordvpn connect ${hostname}`, (error, stdout, stderr) => {
        console.log(error, stderr, stdout);
        if (error) {
          this.$q.notify({
            message: stderr
          });
        }
      });
    },
    async getServers() {
      exec(
        "curl --silent https://api.nordvpn.com/v1/servers/recommendations\?limit=5",
        (error, stdout, stderr) => {
          if (stdout) {
            let servers = [];
            _.each(JSON.parse(stdout), (s, k) => {
              servers.push(s);
            });
            _.orderBy(servers, s => s.load);
            this.$store.commit("setServers", servers);
          } else if (error) {
            console.error(error);
          }
        }
      );
    }
  }
};
</script>
