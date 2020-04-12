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
import { exec } from "child_process";
export default {
  name: "Login",
  data() {
    return {
      password: this.$q.localStorage.getItem("nordvpnPassword", this.password),
      username: this.$q.localStorage.getItem("nordvpnUsername", this.username),
      progress: "username",
      status: undefined
    };
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  created() {
    window.ptyProcess.write("nordvpn login\r");

    window.ptyProcess.onData(async data => {
      console.log(data);

      /**
       * Catch some response from nordvpn cli
       */

      if (data.includes("Username or password is not correct")) {
        this.progress = "username";
        this.$root.$emit("update:login", true);
        this.$q.notify({
          type: "negative",
          message: `Username or password is not correct.`
        });

        /**
         *
         *
         *
         */
      } else if (data.includes("Too many login attempts.")) {
        // TOO MANY ATTEMPTS
        this.progress = "username";
        window.ptyProcess.write("nordvpn login\r");
        this.$q.notify({
          type: "warning",
          message: `Too many login attempts, please start over.`
        });
        this.$root.$emit("update:login", true);
        /**
         *
         *
         *
         */
      } else if (data.includes("Welcome to NordVPN!")) {
        // SUCCESS
        this.$q.notify({
          type: "positive",
          message: `Welcome to NordVPN!`
        });
        this.getAccount();
        this.$store.commit("setLogin", true);

        this.setStatus();
      } else if (data.includes("You are logged out.")) {
        // LOGGED OUT
        this.$store.commit("setLogin", false);
        this.setStatus();
      } else if (data.includes("You are already logged in")) {
        // LOGGED IN
        this.$store.commit("setLogin", true);

        this.setStatus();

        this.$q.notify({
          type: "positive",
          message: `Welcome back to NordVPN!`
        });
        this.getAccount();
      } else if (data.includes("Whoops! We couldn't connect you")) {
        this.$q.notify({
          type: "negative",
          message: `Whoops! We couldn't connect you to this country. Please try again. If the problem persists, contact our customer support.`
        });

        this.setStatus();
      } else if (data.includes("You are connected to")) {
        this.setStatus();
        this.$q.notify({
          type: "positive",
          message: `You are succesfully connected.`
        });
      } else if (data.includes("You are disconnected from NordVPN.")) {
        this.setStatus();
        this.$q.notify({
          type: "positive",
          message: `You have succesfully disconnected from NordVPN.`
        });
      }

      if (data.includes("Please enter your login details")) {
        this.$root.$emit("update:login", true);
      }
    });
  },

  beforeDestroy() {
    this.progress = "username";
  },
  mounted() {
    this.$root.$on("update:status", () => {
      this.setStatus();
    });
  },

  beforeDestroy() {
    this.$root.$off("update:status");
  },

  methods: {
    async setStatus() {
      exec("nordvpn status", (err, stdout, stderr) => {
        if (err || stderr) return false;
        let status = {};
        _.each(stdout.split("\n"), d => {
          if (!d) return false;
          let line = d.split(": ");
          status[line[0].replace(/-/i, "").toLowerCase()] = line[1];
        });
        this.$store.commit("setStatus", status);
        this.$q.electron.ipcRenderer.send("update:status", status);
      });
    },
    getAccount() {
      exec("nordvpn account", (err, stdout, esterr) => {
        if (stdout) {
          let account = {};
          _.each(stdout.split("\n"), d => {
            if (!d) return false;
            let line = d.split(": ");
            account[
              line[0]
                .replace(/-/i, "")
                .replace(/ /i, "")
                .toLowerCase()
            ] = line[1];
          });
          this.$store.commit("setAccount", account);
        }
      });
    },
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
