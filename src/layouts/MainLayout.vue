<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="list_alt"
          aria-label="Menu"
        />

        <q-toolbar-title>
          <q-img
            src="statics/nordvpn-for-pc-windows-mac.png"
            height="32px"
            width="32px"
          />
          <span style="font-size: 0.8em; margin-left: 12px"
            >NordVPN for Linux</span
          >
        </q-toolbar-title>
        <q-space />
        <q-btn
          flat
          dense
          @click="settingsDialog = !settingsDialog"
          icon="settings"
          aria-label="Menu"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
      :width="200"
      behavior="desktop"
    >
      <ServerList />
    </q-drawer>

    <q-dialog v-model="settingsDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Settings</div>
        </q-card-section>
        <q-card-section>
          <q-toolbar class="bg-grey-3">
            <q-img
              src="statics/nordvpn-for-pc-windows-mac.png"
              height="32px"
              width="32px"
            />
            <q-space />
            <q-btn
              icon="logout"
              round
              flat
              dense
              @click="logout()"
              v-if="$store.state.isLoggedIn"
            />
          </q-toolbar>
          <q-item v-if="$store.state.isLoggedIn">
            <q-item-section>
              Logged in as: <br />
              VPN:
            </q-item-section>
            <q-item-section>
              {{ $store.state.account.emailaddress }}<br />
              {{ $store.state.account.vpnservice }}
            </q-item-section>
          </q-item>
          <!--
      <q-expansion-item label="Options" icon="account_circle" group="1">
        <Options />
      </q-expansion-item>
      -->
          <q-expansion-item
            default-opened
            label="Settings"
            icon="settings"
            group="1"
          >
            <Settings />
          </q-expansion-item>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-footer>
      <div class="row">
        <div class="col-xs-11">
          <q-tabs
            @input="$root.$emit('update:status')"
            v-model="tab"
            dense
            align="left"
            switch-indicator
          >
            <q-tab name="terminal" label="Terminal" />
            <q-tab name="connection" label="Connection" />
          </q-tabs>
        </div>
        <div class="col-xs-1 text-right">
          <q-btn round flat @click="toggleBottomNav()" dense>
            <q-icon name="keyboard_arrow_up" v-if="!bottomNav" />
            <q-icon name="keyboard_arrow_down" v-if="bottomNav" />
          </q-btn>
        </div>
      </div>

      <div v-if="bottomNav">
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="terminal" dense class="q-pa-xs">
            <Terminal />
          </q-tab-panel>

          <q-tab-panel name="connection" dense class="q-pa-xs">
            <q-markup-table flat>
              <tbody>
                <tr
                  v-for="(value, setting) in $store.state.status"
                  v-bind:key="setting"
                >
                  <td class="text-subtitle2 text-capitalize">{{ setting }}</td>
                  <td>{{ value }}</td>
                </tr>
              </tbody></q-markup-table
            >
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-footer>

    <q-page-container>
      <router-view />
      <Status />
    </q-page-container>

    <q-page-sticky position="top-right">
      <q-circular-progress
        v-if="connecting"
        indeterminate
        size="50px"
        color="primary"
        class="q-ma-md"
      />
    </q-page-sticky>

    <Sudo :dialog="sudo" />
    <Login :dialog="login" />
  </q-layout>
</template>

<script>
import Settings from "components/Settings";
import Terminal from "src/components/Terminal.vue";
import Status from "src/components/Status";
import Sudo from "src/components/Sudo.vue";
import Login from "src/components/Login.vue";
import ServerList from "src/components/ServerList.vue";
//import Options from "src/components/Options.vue";

export default {
  name: "MainLayout",

  components: {
    Settings,
    Terminal,
    Status,
    Sudo,
    ServerList,
    //Options,
    Login
  },

  watch: {
    tab() {
      if (this.tab !== null) this.bottomNav = true;
    }
  },

  mounted() {
    this.$root.$on("update:sudo", v => {
      this.sudo = v;
    });
    this.$root.$on("update:login", v => {
      this.login = v;
    });
    this.$root.$on("update:connecting", v => {
      console.log("updating status connection");
      this.connecting = v;
    });
  },

  beforeDestroy() {
    this.$root.$off("update:sudo");
    this.$root.$off("update:login");
    this.$root.$off("update:connecting");
  },

  methods: {
    test() {},
    toggleBottomNav() {
      if (this.bottomNav === true) {
        this.bottomNav = false;
        this.tab = null;
      } else {
        this.bottomNav = true;
        if (this.tab === null) {
          this.tab = "mails";
        }
      }
    },
    logout() {
      window.ptyProcess.write("nordvpn logout\r");
    },
    signin() {
      window.ptyProcess.write("nordvpn login\r");
    }
  },

  data() {
    return {
      leftDrawerOpen: false,
      bottomNav: false,
      settingsDialog: false,
      connecting: false,
      tab: null,
      sudo: false,
      login: false,
      essentialLinks: [
        {
          title: "Docs",
          caption: "quasar.dev",
          icon: "school",
          link: "https://quasar.dev"
        },
        {
          title: "Github",
          caption: "github.com/quasarframework",
          icon: "code",
          link: "https://github.com/quasarframework"
        },
        {
          title: "Discord Chat Channel",
          caption: "chat.quasar.dev",
          icon: "chat",
          link: "https://chat.quasar.dev"
        },
        {
          title: "Forum",
          caption: "forum.quasar.dev",
          icon: "record_voice_over",
          link: "https://forum.quasar.dev"
        },
        {
          title: "Twitter",
          caption: "@quasarframework",
          icon: "rss_feed",
          link: "https://twitter.quasar.dev"
        },
        {
          title: "Facebook",
          caption: "@QuasarFramework",
          icon: "public",
          link: "https://facebook.quasar.dev"
        }
      ]
    };
  }
};
</script>
