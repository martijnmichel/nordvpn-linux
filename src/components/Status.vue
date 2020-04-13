<template>
  <q-card id="status">
    <q-card-section class="q-pa-sm" v-if="status.status === 'Disconnected'">
      <q-list>
        <q-item>
          <q-item-section avatar>
            <q-icon name="vpn_key" class="text-negative" />
          </q-item-section>
          <q-item-section>
            <q-item-label overline class="text-negative"
              >UNPROTECTED</q-item-label
            >
            <q-item-label class="text-body1"
              >Pick a country or use quick connect</q-item-label
            >
          </q-item-section>
          <q-item-section side top>
            <q-btn
              label="Quick connect"
              @click="connect()"
              color="primary"
            ></q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-card-section class="q-pa-sm" v-if="status.status === 'Connected'">
      <q-list>
        <q-item>
          <q-item-section avatar>
            <q-icon name="vpn_key" class="text-positive" />
          </q-item-section>
          <q-item-section>
            <q-item-label overline class="text-positive"
              >PROTECTED</q-item-label
            >
            <q-item-label class="text-body1">
              <span class="text-bold"
                >{{ status.city }}, {{ status.country }}</span
              >
              <span class="text-caption text-grey-6">
                ({{ status["your new ip"] }})</span
              >
            </q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-btn
              label="disconnect"
              @click="disconnect()"
              color="negative"
            ></q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped>
#status {
  position: relative;
  bottom: 100px;
  width: 600px;
  left: 50%;
  margin-left: -300px;
  background: white;
}
</style>

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
    connect() {
      if (this.status.status === "Disconnected") {
        window.ptyProcess.write("nordvpn connect\r");
      }
    },
    disconnect() {
      if (this.status.status === "Connected") {
        window.ptyProcess.write("nordvpn disconnect\r");
      }
    }
  }
};
</script>
