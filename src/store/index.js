import Vue from "vue";
import Vuex from "vuex";

// import example from './module-example'

Vue.use(Vuex);

//import { nordvpn } from "./nordvpn";

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
    },

    state: {
      servers: [],
      status: {},
      settings: {}
    },
    mutations: {
      setServers: (state, data) => {
        state.servers = data;
      },
      setStatus: (state, data) => {
        state.status = data;
      },
      setSettings: (state, data) => {
        state.settings = data;
      }
    },
    actions: {},
    getters: {
      servers: state => {
        return state.servers;
      }
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });

  return Store;
}
