import Storage from '../../utils/Storage';

export default {
    namespaced: true,
    state() {
        return {
            filter: Storage.getItem('filter'),
            filters: Storage.getItem('filters') ? Storage.getItem('filters') : [],
        };
    },
    mutations: {
        set(state, filter) {
            // if (filter.isNewRecord) {
                state.filters.push(filter);
            // }
            filter.isNewRecord = false;

            Storage.setItem('filter', filter);
            Storage.setItem('filters', state.filters);
        },
    },
    actions: {
    },
    getters: {
        one(state) {
            return state.filter ? state.filter : {};
        },
        all(state) {
            return state.filters ? state.filters : {};
        },
    }
}
