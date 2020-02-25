<template>
  <q-list>
    <q-item tag="label" v-ripple>
      <q-item-section>
        <q-item-label>Auto connect</q-item-label>
        <q-item-label caption
          >When enabled, this feature will automatically connect to nordvpn upon
          system startup.</q-item-label
        >
      </q-item-section>
      <q-item-section avatar>
        <q-toggle v-model="settings.autoconnect" />
      </q-item-section>
    </q-item>
    <q-item tag="label" v-ripple>
      <q-item-section>
        <q-item-label>Cybersec</q-item-label>
        <q-item-label caption
          >When enabled, this feature block calls to suspicious websites that
          can affect your device.</q-item-label
        >
      </q-item-section>
      <q-item-section avatar>
        <q-toggle v-model="settings.cybersec" />
      </q-item-section>
    </q-item>
    <q-item tag="label" v-ripple>
      <q-item-section>
        <q-item-label>Kill switch</q-item-label>
        <q-item-label caption
          >This security feature blocks your device from the internet while not
          connected to a vpn or in case the connection to the vpn was
          lost.</q-item-label
        >
      </q-item-section>
      <q-item-section avatar>
        <q-toggle v-model="settings.killswitch" />
      </q-item-section>
    </q-item>
    <q-item tag="label" v-ripple>
      <q-item-section>
        <q-item-label>Notify</q-item-label>
        <q-item-label caption>Enable or disable notifications.</q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-toggle v-model="settings.notify" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { exec } from "child_process";
export default {
  name: "Settings",
  data() {
    return {
      settings: {}
    };
  },
  computed: {},
  beforeDestroy() {
    this.$root.$off("updateSettings");
  },
  created() {
    this.$root.$on("updateSettings", () => {
      let x = 0;
      this.interval = setInterval(() => {
        x++;
        this.getSettings();
        if (x === 10) clearInterval(this.interval);
      }, 1000);
    });
  },
  mounted() {
    this.getSettings();
  },
  watch: {
    "settings.autoconnect": function(val) {
      exec(`nordvpn set autoconnect ${val}`, (err, stdout, stderr) => {
        this.getSettings();
      });
    },
    "settings.cybersec": function(val) {
      exec(`nordvpn set cybersec ${val}`, (err, stdout, stderr) => {
        this.getSettings();
      });
    }
  },
  methods: {
    getSettings() {
      exec("nordvpn settings", (err, stdout, esterr) => {
        let settings = {};
        _.each(stdout.split("\n"), d => {
          if (!d) return false;
          let line = d.split(": ");
          let value = line[1];
          if (value === "disabled") value = false;
          else if (value === "enabled") value = true;
          settings[
            line[0]
              .replace(/-/i, "")
              .replace(" ", "")
              .toLowerCase()
          ] = value;
        });
        this.$store.commit("setSettings", settings);
        this.$set(this, "settings", JSON.parse(JSON.stringify(settings)));
      });
    }
  }
};
</script>

<style></style>
