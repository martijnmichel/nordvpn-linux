<template>
  <q-page class="flex flex-center">
    <WorldMap />
  </q-page>
</template>

<script>
import WorldMap from "src/components/WorldMap.vue";
export default {
  name: "PageIndex",
  components: { WorldMap },
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
