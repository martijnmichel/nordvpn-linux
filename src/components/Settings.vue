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
        <q-item-label>Obfuscate</q-item-label>
        <q-item-label caption
          >When enabled, this feature will allow to bypass network traffic
          sensors that aim to detect usage of protocol and log, throttle or
          block it.</q-item-label
        >
      </q-item-section>
      <q-item-section avatar>
        <q-toggle v-model="settings.obfuscate" />
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
    <q-item tag="label" v-ripple>
      <q-item-section>
        <q-item-label>Protocol</q-item-label>
        <q-item-label caption>Sets the protocol to use.</q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-btn-toggle
          v-model="settings.protocol"
          toggle-color="primary"
          :options="[
            { label: 'TCP', value: 'TCP' },
            { label: 'UDP', value: 'UDP' }
          ]"
        />
      </q-item-section>
    </q-item>
    <q-item tag="label" v-ripple>
      <q-item-section>
        <q-item-label>Technology</q-item-label>
        <q-item-label caption>Sets the technology to use.</q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-btn-toggle
          v-model="settings.technology"
          toggle-color="primary"
          :options="[
            { label: 'OpenVPN', value: 'OpenVPN' },
            { label: 'NordLynx', value: 'NordLynx' }
          ]"
        />
      </q-item-section>
    </q-item>
    <q-item tag="label" v-ripple v-if="!settings.cybersec">
      <q-item-section>
        <q-item-label>DNS</q-item-label>
        <q-item-label caption
          >Sets custom DNS servers. <br />
          (Disabled when Cybersec is turned on.)</q-item-label
        >
      </q-item-section>
      <q-item-section avatar>
        <q-input v-model="settings.dns" outlined dense @blur="saveDNS()" />
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
    settings: {
      deep: true,
      handler: function(val) {
        _.each(val, (value, setting) => {
          if (setting === "dns") return false;
          if (value !== this.$store.state.settings[setting]) {
            exec(`nordvpn set ${setting} ${value}`, (err, stdout, stderr) => {
              this.getSettings();
            });
          }
        });
      }
    }
  },
  methods: {
    saveDNS() {
      exec(`nordvpn set dns ${this.settings.dns}`, (err, stdout, stderr) => {
        this.getSettings();
      });
    },
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
              .replace(/ /i, "")
              .trim()
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
