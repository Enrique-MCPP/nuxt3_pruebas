import { createApp } from 'vue'
import App from './App.vue'
import Keycloak from 'keycloak-js'
import PrimeVue from 'primevue/config';
import VTooltip from 'v-tooltip';

import 'primevue/resources/themes/nova/theme.css'
//import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Panel from 'primevue/panel';
import Menubar from 'primevue/menubar';

import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import MultiSelect from 'primevue/multiselect';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';

const app = createApp(App);
app.use(PrimeVue);
app.use(ToastService);
app.use(VTooltip);
app.component('p:inputText', InputText);
app.component('p_toast', Toast);
app.component('p:dataTable', DataTable);
app.component('p_column', Column);
app.component('p:commandButton', Button);
app.component('p_panel', Panel);
app.component('p_menubar', Menubar);
app.component('p:selectOneMenu', Dropdown);
app.component('p_dialog', Dialog);
app.component('TextArea', Textarea);
app.component('p:selectCheckBoxMenu', MultiSelect);
app.component('p:triStateCheckbox', TriStateCheckbox);
app.component('p_calendar', Calendar);
app.component('p_card', Card);

// JSON VIEWER
import JsonViewer from "vue3-json-viewer";
import "vue3-json-viewer/dist/index.css";
app.use(JsonViewer);
import mitt from 'mitt'
const emitter = mitt();
app.config.globalProperties.emitter = emitter;

// VUEX
import store from "@/store/user";

app.use(store); // usa el store en tu aplicación

// AXIOS
import axios from 'axios'
import VueAxios from 'vue-axios'
app.use(VueAxios, axios)


// KEYCLOAK
const initOptions = {
    url: process.env.VUE_APP_KEYCLOAK_API_URL,
    realm: process.env.VUE_APP_KEYCLOAK_REALM,
    clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID,
}

const keycloak = Keycloak(initOptions)

keycloak.init({ onLoad: 'login-required' }).then(() => {
    let roles = keycloak.realmAccess.roles;
    roles = roles.filter(role => !role.includes("offline_access") && !role.includes("uma_authorization") && !role.includes("default-roles-spring-boot-microservices-realm"));
    store.commit('setUserName', keycloak.tokenParsed.preferred_username)
    store.commit('setKeycloakToken', keycloak.token)
    store.commit('setKeycloakTokenParsed', keycloak.tokenParsed)
    store.commit('setRoles', roles);

    emitter.on('keycloak-logout', () => {
        keycloak.logout()
    })

    // Token Refresh
    setInterval(() => {
        keycloak
            .updateToken(70)
            .then((refreshed) => {
                if (refreshed) {
                    let roles = keycloak.realmAccess.roles;
                    roles = roles.filter(role => !role.includes("offline_access") && !role.includes("uma_authorization") && !role.includes("default-roles-spring-boot-microservices-realm"));
                    store.commit('setUserName', keycloak.tokenParsed.preferred_username)
                    store.commit('setKeycloakToken', keycloak.token)
                    store.commit('setKeycloakTokenParsed', keycloak.tokenParsed)
                    store.commit('setRoles', roles)
                    console.info('Token refreshed' + refreshed)
                } else {
                    console.warn('Token not refreshed, valid for ' + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds')
                }
            })
            .catch(() => {
                keycloak.logout()
            })
    }, 60 * 1000)
    app.mount('#app')
})

