<template>
  <q-list>
    <q-item
      clickable
      v-ripple
      dense
      @click="connect(server.code)"
      v-for="server in servers"
      :key="server.id"
    >
      <q-item-section side>
        <q-avatar size="xs">
          <img :src="getFlag(server.code)" />
        </q-avatar>
      </q-item-section>
      <q-item-section class="text-body2">{{ server.name }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { exec } from "child_process";
import _ from "lodash";
const axios = require("axios");
export default {
  name: "ServerList",
  data() {
    return {
      servers: [],
      countries: []
    };
  },
  async created() {
    await axios.get(`https://restcountries.eu/rest/v2/all`).then(re => {
      this.countries = re.data;
    });
    exec(
      "curl --silent https://api.nordvpn.com/v1/servers/countries",
      (error, stdout, stderr) => {
        if (stdout) {
          this.servers = JSON.parse(stdout);
        } else if (error) {
          console.error(error);
        }
      }
    );
  },
  methods: {
    connect(code) {
      window.ptyProcess.write(`nordvpn connect ${code}\r`);
    },
    getFlag(code) {
      return this.countries.find(c => c.alpha2Code === code).flag;
    }
  }
};
</script>
