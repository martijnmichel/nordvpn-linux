<template>
  <q-list>
    <q-item tag="label" v-ripple>
      <q-item-section>
        <q-item-label>Menu item</q-item-label>
        <q-item-label caption
          >Create a menu item to easily start NordVPN Linux</q-item-label
        >
      </q-item-section>
      <q-item-section avatar>
        <q-btn color="primary" @click="createMenuItem()" label="Create" />
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

  methods: {
    async createMenuItem() {
      // destination.txt will be created or overwritten by default.
      await window.ptyProcess.write(
        "sh src/bash/nordvpn-install.sh /bla\r",
        (err, stdout, stderr) => {
          if (err) throw err;
        }
      );
      //this.$root.$emit("update:sudo", true);
      /*
      window.ptyProcess.on("data", data => {
        if (data.includes("password")) {
          this.$root.$emit("update:sudo", true);
          window.ptyProcess.off("data");
        }
      });
      */
    }
  }
};
</script>

<style></style>
