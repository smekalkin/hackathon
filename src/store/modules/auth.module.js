import router from '../../router'
import AuthService from '../../services/AuthService';
import Storage from '../../utils/Storage';

export default {
    namespaced: true,
    state() {
        return {
            token: Storage.getItem('jwt-token'), // Получение токена из Storage при его наличии. Если его нет, то авторизация.
            info: Storage.getItem('info'),
        };
    },
    mutations: {
        setToken(state, token) {
            state.token = token;

            Storage.setItem('jwt-token', token);
        },
        setInfo(state, info) {
            state.info = info;

            Storage.setItem('info', info);
        },
    },
    actions: {
        async login({ commit, dispatch, rootState }, service) {
            rootState.loadingPage = true;

            let data = await service.token();

            if (data) {
                commit('setToken', data.access_token);
                commit('setInfo', null);

                // not work - not token in http
                // await dispatch('info');

                router.go();
            }

            rootState.loadingPage = false;
        },
        async logout({ commit, rootState }) {
            rootState.loadingPage = true;

            let authService = new AuthService();
            await authService.tokenDelete();

            commit('setToken', null);
            commit('setInfo', null);

            router.go();

            rootState.loadingPage = false;
        },
        async info({ commit, state, rootState }) {
            if (!state.info) {
                rootState.loadingPage = true;

                let authService = new AuthService();
                let info = await authService.info();

                commit('setInfo', info);

                rootState.loadingPage = false;
            }
        }
    },
    getters: {
        isAuthenticated(state) {
            return !!state.token;
        },
        user(state) {
            return state.info ? state.info.user : {};
        },
        struc(state) {
            return state.info ? state.info.struc : [];
        },
        isAppIdentifier: (state, getters) => (identifier) => {
            let identifiers = state.info ? state.info.appIdentifiers : [];

            for (let ident of identifiers) {
                if (ident == identifier) {
                    return true;
                }
            }

            return false;
        },
        isAdmin(state) {
            return state.info ? state.info.isAdmin : false;
        },
        permissionNames(state) {
            return state.info ? state.info.permissionNames : [];
        },
    }
}
