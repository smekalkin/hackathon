import { createStore } from 'vuex'
import auth from './modules/auth.module'
import client from './modules/client.module'
import filter from './modules/filter.module'
import building from './modules/building.module'

export default createStore({
  state() {
    return {
      menuItems: [],
      locale: localStorage.getItem('locale') || 'ru',
      loadingPage: false,
      modals: [],
      modalActiveIndex: null,
      routerViewKey: 0, // ключ обновления страницы
      history: {},
      historyBack: false
    };
  },
  mutations: {
    setLoadingPage(state, loadingPage) {
      state.loadingPage = loadingPage;
    },
    addModal(state, modal) {
      // удаляем все закрытые модальные окна
      for (let i = state.modals.length; i--;) {
        if (!state.modals[i].isOpen) {
          state.modals.splice(i, 1);
        }
      }

      // и добавляем новое модальное окно
      state.modals.push(modal);
      state.modalActiveIndex = state.modals.length - 1;
    },
    setModal(state, index) {
      index = index || -1; // при -1 закрываются все окна
      state.modalActiveIndex = null;

      // открываем окна по указанный index
      for (let i in state.modals) {
        if (i > index) {
          state.modals[i].isOpen = false;
          state.modals[i].isAutoClose = true;
        } else {
          state.modals[i].isOpen = true;
          state.modals[i].isAutoClose = false;
          state.modalActiveIndex = i;
        }
      }
    },
    delModals(state) {
      state.modals = [];
    },
    reloadPage(state) {
      state.routerViewKey++;
    },
    setHistory(state) {
      state.history = window.history;
      state.historyBack = window.history.state.back;
    }
  },
  actions: {
  },
  getters: {
    loadingPage(state) {
      return state.loadingPage;
    },
    modals(state) {
      return state.modals;
    },
    modalActiveIndex(state) {
      return state.modalActiveIndex;
    },
    routerViewKey(state) {
      return state.routerViewKey;
    },
    can: (state, getters) => (permissionName) => {
      return true;
      // return getters['auth/isAdmin'] || getters['auth/permissionNames'].includes(permissionName);
    },
    historyBack(state) {
      return state.historyBack;
    }
  },
  modules: {
    auth,
    client,
    filter,
    building,
  }
});
