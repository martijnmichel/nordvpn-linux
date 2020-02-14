export const nordvpn = {
  namespaced: true,
  state: {
    servers: []
  },
  mutations: {
    setServers: (state, data) => {
      state.servers = data;
    }
  },
  actions: {},
  getters: {
    servers: state => {
      return state.servers;
    }
  }
};
