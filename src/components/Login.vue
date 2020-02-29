<template>
  <q-dialog v-model="dialog" persistent>
    <q-card>
      <q-card-section title
        >Please insert your NordVPN login details</q-card-section
      >
      <q-card-section v-if="progress === 'username'">
        <q-input
          type="text"
          v-model="username"
          @keyup.enter.native="sendUsr()"
          outlined
          label="Username"
        >
          <template v-slot:append>
            <q-btn
              icon="chevron_right"
              round
              flat
              dense
              class="bg-grey-3"
              @click="sendUsr()"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-card-section v-if="progress === 'password'">
        <q-input
          type="password"
          v-model="password"
          @keyup.enter.native="sendPwd()"
          outlined
          label="Password"
        >
          <template v-slot:append>
            <q-btn
              icon="chevron_right"
              round
              flat
              dense
              class="bg-grey-3"
              @click="sendPwd()"
            />
          </template>
        </q-input>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      password: this.$q.localStorage.getItem("nordvpnPassword", this.password),
      username: this.$q.localStorage.getItem("nordvpnUsername", this.username),
      progress: "username"
    };
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  async created() {
    await window.ptyProcess.write("nordvpn login\r");
    window.ptyProcess.on("data", data => {
      console.log(data);
      /**
       * Catch some response from nordvpn cli
       */

      if (data.includes("Username or password is not correct")) {
        this.progress = "username";
        this.$q.notify({
          type: "negative",
          message: `Username or password is not correct.`
        });
        this.$root.$emit("update:login", true);
      } else if (data.includes("Too many login attempts.")) {
        this.progress = "username";
        window.ptyProcess.write("nordvpn login\r");
        this.$q.notify({
          type: "warning",
          message: `Too many login attempts, please start over.`
        });
        this.$root.$emit("update:login", true);
      } else if (data.includes("Welcome to NordVPN!")) {
        this.$q.notify({
          type: "positive",
          message: `Welcome to NordVPN!`
        });
        this.$store.commit("setLogin", true);
      } else if (data.includes("You are logged out.")) {
        this.$store.commit("setLogin", false);
      } else if (data.includes("You are already logged in")) {
        this.$store.commit("setLogin", true);
      }

      if (data.includes("Please enter your login details")) {
        this.$root.$emit("update:login", true);
      }
    });
  },

  beforeDestroy() {
    this.progress = "username";
  },
  mounted() {},

  methods: {
    sendUsr() {
      window.ptyProcess.write(`${this.username}\r`);
      this.progress = "password";
      this.$q.localStorage.set("nordvpnUsername", this.username);
    },
    sendPwd() {
      window.ptyProcess.write(`${this.password}\r`);
      this.$q.localStorage.set("nordvpnPassword", this.password);
      this.$root.$emit("update:login", false);
    }
  }
};
</script>
