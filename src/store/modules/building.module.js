import Storage from '../../utils/Storage';

export default {
    namespaced: true,
    state() {
        return {
            favorites: Storage.getItem('favorites') ? Storage.getItem('favorites') : [],
        };
    },
    mutations: {
        addFavorite(state, building) {
            state.favorites.push(building.id);

            Storage.setItem('favorites', state.favorites);
        },
        delFavorite(state, building) {
            for (let i = state.favorites.length; i--;) {
                if (state.favorites[i] == building.id) {
                    state.favorites.splice(i, 1);
                }
            }

            Storage.setItem('favorites', state.favorites);
        },
    },
    actions: {
    },
    getters: {
        isFavorite: (state, getters) => (building) => {
            return state.favorites.includes(building.id);
        },
    }
}
