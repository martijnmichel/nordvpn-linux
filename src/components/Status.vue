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
  beforeDestroy() {},
  created() {},
  mounted() {},
  methods: {
    async disconnect() {
      if (this.status.status === "Connected") {
        await window.ptyProcess.write("nordvpn disconnect\r");
      }
    }
  }
};
</script>

<style></style>
