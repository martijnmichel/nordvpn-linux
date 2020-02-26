<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>
          NordVPN
        </q-toolbar-title>

        <Status />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
      :width="500"
    >
      <q-list>
        <q-item-label header class="text-grey-8">Settings</q-item-label>
        <Settings />
      </q-list>
    </q-drawer>

    <q-footer>
      <div class="row">
        <div class="col-xs-11">
          <q-tabs v-model="tab" dense align="left" switch-indicator>
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
    </q-page-container>
  </q-layout>
</template>

<script>
import Settings from "components/Settings";
import Terminal from "src/components/Terminal.vue";
import Status from "src/components/Status";

export default {
  name: "MainLayout",

  components: {
    Settings,
    Terminal,
    Status
  },

  watch: {
    tab() {
      if (this.tab !== null) this.bottomNav = true;
    }
  },

  methods: {
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
    }
  },

  data() {
    return {
      leftDrawerOpen: false,
      bottomNav: false,
      tab: null,
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
