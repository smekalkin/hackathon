import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '../store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      meta: { auth: false },
    },

    // Building
    {
      path: '/building',
      name: 'Building',
      component: () => import('../modules/building/views/building/Index.vue'),
      meta: { auth: false },
    },
    {
      path: '/building/:id',
      name: 'BuildingShow',
      component: () => import('../modules/building/views/building/Show.vue'),
      meta: { auth: false },
    },

    // Client
    {
      path: '/client',
      name: 'Client',
      component: () => import('../modules/client/views/client/Index.vue'),
      meta: { auth: false },
    },
    {
      path: '/client/create',
      name: 'ClientCreate',
      component: () => import('../modules/client/views/client/Create.vue'),
      meta: { auth: false },
    },

    // Filter
    {
      path: '/filter',
      name: 'Filter',
      component: () => import('../modules/filter/views/filter/Index.vue'),
      meta: { auth: false },
    },
    {
      path: '/filter/create',
      name: 'FilterCreate',
      component: () => import('../modules/filter/views/filter/Create.vue'),
      meta: { auth: false },
    },
  ]
});

var goPath = null;
router.beforeEach((to, from, next) => {
  store.commit('setHistory');

  // console.log('----------------------------');
  let fullPath = window.location.pathname + window.location.search + window.location.hash;
  // console.log('fullPath', fullPath);
  // console.log('from.fullPath', from.fullPath);
  // console.log('to.fullPath', to.fullPath);

  // Если перешли по ссылке на основную немодальную страницу, то закрываем все модальные окна с учетом истории
  if (from.fullPath === to.fullPath && to.fullPath !== fullPath && store.getters.modalActiveIndex !== null) {
    // console.log('reloadPage');
    window.history.go(- store.getters.modalActiveIndex - 1);
    store.commit('setModal');
    store.commit('reloadPage');
    return;
  }

  // Если это не стартовая страница которую мы отрыли и она является модальным окном, которое открыто именно модально
  if (from.name && (from.fullPath !== to.fullPath) && to.meta.isModal && (!goPath || goPath === to.fullPath)) {
    goPath = null;
    let modals = store.getters.modals;
    // console.log('modals', modals);
    for (let i in modals) {
      // console.log('modals[i].to.fullPath', modals[i].to.fullPath);
      if (modals[i].to.fullPath === to.fullPath) {
        if (!modals[i].isOpen) {
          // доб. параметры пишем даже если одинаковый url, чтобы работало при forward
          from.params = modals[i].to.params || {};
          from.query = modals[i].to.query || {};
          from.hash = modals[i].to.hash || {};
        }

        if (to.fullPath !== fullPath) { // если перешли не по тому же пути
          window.history.go(store.getters.modalActiveIndex === null ? parseInt(i) + 1 : i - store.getters.modalActiveIndex);

          // console.log('go', store.getters.modalActiveIndex === null ? parseInt(i) + 1 : i - store.getters.modalActiveIndex);

          return;
        }

        // переходим к модальному окну по текущий индекс
        store.commit('setModal', i);

        // console.log('setModal - i', i);

        // если найдено окно, то завершаем
        return;
      }
    }

    // console.log('add new modal', modals);

    // добавочные параметры для того чтобы работало стандартное взятие параметров из роута в компонентах
    from.params = to.params || {};
    from.query = to.query || {};
    from.hash = to.hash || {};

    window.history.pushState(null, to.fullPath, to.fullPath);

    let defaultComponent = to.matched[0].components.default;

    // импортируем компонент из роута. Если он еще не инициализирован, то определится как функция
    let component =
      typeof defaultComponent === 'function' ? defineAsyncComponent(defaultComponent) : defaultComponent;

    // добавляем/открываем модальное окно
    store.commit('addModal', { to: to, component: component, isOpen: true, size: to.meta.modalSize });
  } else {
    // console.log('standartPage');
    goPath = null;

    if (from.fullPath === to.fullPath) {
      // Закрываем все модальные окна, если перешли на основную немодальную страницу
      // console.log('setModal');
      store.commit('setModal');
    } else {
      // Удаляем все модальные окна, если перешли на совсем другую немодальную страницу
      // console.log('delModals');
      store.commit('delModals');
    }

    to.meta.auth = (to.meta.auth === undefined) ? true : to.meta.auth
    to.meta.layout = (to.meta.layout === undefined) ? 'main' : to.meta.layout

    const requireAuth = to.meta.auth;
    const isAuthenticated = store.getters['auth/isAuthenticated'];

    if (isAuthenticated) {
      if (to.path === '/auth') {
        next('/');
      } else {
        next();
      }
    } else if (requireAuth) {
      if (to.path === '/') {
        next('/auth');
      } else {
        next('/auth?message=auth');
      }
    } else {
      next();
    }
  }
});

export default router;
