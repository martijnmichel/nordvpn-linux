<template>
  <q-dialog v-model="dialog" persistent>
    <q-card>
      <q-card-section title>Please insert your admin password</q-card-section>
      <q-card-section>
        <q-input
          type="password"
          v-model="password"
          @keyup.enter.native="send()"
          outlined
        >
          <template v-slot:append>
            <q-btn
              icon="chevron_right"
              round
              flat
              dense
              class="bg-grey-3"
              @click="send()"
            />
          </template>
        </q-input>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "Sudo",
  data() {
    return {
      password: ""
    };
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  created() {
    window.ptyProcess.on("data", data => {
      if (data.includes("sudo")) {
        this.$root.$emit("update:sudo", true);
      }
    });
  },

  methods: {
    send() {
      window.ptyProcess.write(`${this.password}\r`);
      this.$root.$emit("update:sudo", false);
    }
  }
};
</script>
