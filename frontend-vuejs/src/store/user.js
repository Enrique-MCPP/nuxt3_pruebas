import { createStore } from 'vuex'

const store = createStore({
    state() {
        return {
            username: null,
            keycloakToken: null,
            keycloakTokenParsed: null,
            axiosConfig: {
                headers: {}
            },
            roles: []
        };
    },
    mutations: {
        setUserName(state, val) {
            state.username = val;
        },
        setKeycloakToken(state, val) {
            state.keycloakToken = val;
            state.axiosConfig.headers.Authorization = `Bearer ${val}`
        },
        setKeycloakTokenParsed(state, val) {
            state.keycloakTokenParsed = val;
        },
        setRoles(state, val) {
            state.roles = val;
        }
    },
    getters: {
        username(state) {
            return state.username;
        },
        keycloakToken(state) {
            return state.keycloakToken;
        },
        keycloakTokenParsed(state) {
            return state.keycloakTokenParsed;
        },
        axiosConfig(state) {
            return state.axiosConfig;
        },
        roles(state) {
            return state.roles;
        }
    }
});

export default store;