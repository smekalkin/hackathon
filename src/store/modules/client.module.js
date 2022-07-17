import Storage from '../../utils/Storage';

export default {
    namespaced: true,
    state() {
        return {
            client: Storage.getItem('client'),
            clients: Storage.getItem('clients') ? Storage.getItem('clients') : [],
        };
    },
    mutations: {
        set(state, client) {
            if (client.isNewRecord) {
                state.clients.push(client);
            }
            client.isNewRecord = false;

            Storage.setItem('client', client);
            Storage.setItem('clients', state.clients);
        },
    },
    actions: {
    },
    getters: {
        one(state) {
            return state.client ? state.client : {};
        },
        all(state) {
            return state.clients ? state.clients : {};
        },
    }
}
