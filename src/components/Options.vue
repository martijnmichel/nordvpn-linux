<template>
  <q-list>
    <q-item tag="label" v-ripple>
      <q-item-section>
        <q-item-label>Menu item</q-item-label>
        <q-item-label caption
          >Create a menu item to easily start NordVPN Linux<br />
          --To be implemented</q-item-label
        >
      </q-item-section>
      <q-item-section avatar>
        <q-btn
          color="primary"
          @click="createMenuItem()"
          label="Create"
          disabled
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: "Options",
  data() {
    return {
      settings: {}
    };
  },
  computed: {},
  mounted() {},
  methods: {
    async createMenuItem() {
      var path = require("path");
      var appDir = path.dirname(__filename);

      await window.ptyProcess.write(
        `../statics/bash/nordvpn-install.sh ${appDir}\r`,
        (err, stdout, stderr) => {
          if (err) throw err;
        }
      );
    }
  }
};
</script>

<style></style>
