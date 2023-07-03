<template>
  <!--
  <img alt="Vue logo" src="./assets/logo.png">
  <h3>{{ 'username:' + username }}</h3>
  <h1>Keycloak Token</h1>
  <json-viewer :value="keycloakTokenParsed" copyable boxed sort />
  <h1>Backend Token</h1>
  <BuTTon @click="getBackendTokenInfo"> Auth Token Info</BuTTon>
  <json-viewer :value="backendToken" copyable boxed sort /> -->
  <h3>{{ 'Usuario: ' + username }}</h3>
  <h3>{{ 'Roles: ' + filteredRoles().join(', ') }}</h3>

  <p:commandButton @click="logout"> Logout</p:commandButton>



  <PedidosCRUD />
 
</template>

<script>
import { mapGetters } from 'vuex'


import PedidosCRUD from './componentes/PedidosCRUD.vue'





export default {
  name: 'App',
  components: {


    PedidosCRUD,




  },
  data() {
    return {
      backendToken: null,
    }
  },
  computed: {
    ...mapGetters({
      username: 'username',
      keycloakToken: 'keycloakToken',
      keycloakTokenParsed: 'keycloakTokenParsed',
      roles: 'roles',
    })
  },
  methods: {
    logout() {
      this.emitter.emit('keycloak-logout')
    },
    getBackendTokenInfo() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.keycloakToken}`
        }
      }
      this.axios.get("api/product/", config).then((response) => {
        this.backendToken = response.data
      })
    },
    filteredRoles() {
      return this.roles.filter(role => !role.includes("offline_access") && !role.includes("uma_authorization") && !role.includes("default-roles-spring-boot-microservices-realm"));
    }
  }
}
</script>

<style></style>