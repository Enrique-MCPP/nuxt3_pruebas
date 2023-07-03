<template>
  <div style="margin: 0 auto; width: 80%">
    <p_panel header="Pedidos">
      <p:dataTable :value="pedidos" :paginator="true" :rows="10" v-model:selection="selectedRow"
        class="p-datatable-pedidos" @row-click="onRowSelect" selectionMode="single" dataKey="id"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 20, 50]" responsiveLayout="scroll" filterDisplay="row" v-model:filters="filters"
        :globalFilterFields="['numSeguimiento', 'metodoDePago', 'estado.nombre', 'precioTotal', 'direccionEnvio', 'observaciones']"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}">
        <template #header>
          <div class="flex justify-content-end">
            <span class="p-input-icon-left ">
              <i class="pi pi-search" />
              <p:inputText v-model="filters['global'].value" placeholder="Buscar..." />
            </span>
          </div>
        </template>
        <template #empty>
          No hay pedidos disponibles.
        </template>
        <template #loading>
          Cargando pedidos. por favor, espera.
        </template>
        <p_column field="numSeguimiento" header="Nº de seguimiento" filterMatchMode="contains" ref="numSeguimiento"
          :sortable="true">
          <template #filter="{ filterModel, filterCallback }">
            <p:inputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter"
              placeholder="Buscar por nº de seguimiento " />
          </template>
        </p_column>
        <p_column field="metodoDePago" header="Método de pago" filterMatchMode="contains" ref="metodoDePago"
          :sortable="true">
          <template #filter="{ filterModel, filterCallback }">
            <p:inputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter"
              placeholder="Buscar por método de pago " />
          </template>
        </p_column>
        <p_column field="estado.nombre" header="Estado" filterMatchMode="contains" ref="estado.nombre" :sortable="true">
          <template #filter="{ filterModel, filterCallback }">
            <p:inputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter"
              placeholder="Buscar por estado " />
          </template>
        </p_column>
        <p_column field="precioTotal" header="Precio total" filterMatchMode="contains" ref="precioTotal" :sortable="true">
          <template #filter="{ filterModel, filterCallback }">
            <p:inputText type="number" v-model="filterModel.value" @keydown.enter="filterCallback()"
              class="p-column-filter" placeholder="Buscar por precio " />
          </template>
        </p_column>
        <p_column field="direccionEnvio" header="Dirección de envío" filterMatchMode="contains" ref="direccionEnvio"
          :sortable="true">
          <template #filter="{ filterModel, filterCallback }">
            <p:inputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter"
              placeholder="Buscar por dirección " />
          </template>
        </p_column>
        <p_column field="observaciones" header="Observaciones" filterMatchMode="contains" ref="observaciones"
          :sortable="true">
          <template #filter="{ filterModel, filterCallback }">
            <p:inputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter"
              placeholder="Buscar por observaciones " />
          </template>
        </p_column>
      </p:dataTable>
    </p_panel>
  </div>
  <p_panel style="margin-bottom: 20px;margin: 0 auto; width: 80%">

    <div class="panel-flex" style="margin-bottom: 20px;margin: 0 auto; width: 80%">

      <div style="display: inline-block; margin-right: 10px; vertical-align: middle;">
        <label for="numSeguimiento" style="display: block;">Nº de seguimiento</label>
        <p:inputText id="numSeguimiento" type="text" v-model="this.editedRow.numSeguimiento" :disabled="true"
          style="width: 200px;" />
      </div>

      <div style="display: inline-block; margin-right: 10px; vertical-align: middle;">
        <label for="metodoDePago" style="display: block;">Método de pago</label>
        <p:selectOneMenu id="metodoDePago" v-model="this.editedRow.metodoDePago" :disabled="isDisabled"
          style="width: 200px;" :options="metodosDePago" placeholder="Selecciona un método de pago" />
      </div>

      <div style="display: inline-block; margin-right: 10px; vertical-align: middle;">
        <label for="estado" style="display: block;">Estado</label>
        <p:selectOneMenu id="estado" v-model="this.editedRow.estado" :disabled="isDisabled" style="width: 200px;"
          optionLabel="nombre" placeholder="Selecciona un estado" :options="estados" />
      </div>
      <div>
        <div style="display: inline-block; margin-right: 10px; vertical-align: middle;">
          <label for="productos" style="display: block;">Productos</label>
          <p:commandButton id="productos" label="Selecciona productos" icon="pi pi-external-link"
            @click="openDialogPedidos" :disabled="isDisabled" style="vertical-align: middle;" />
        </div>
        <div style="display: inline-block; margin-right: 10px; vertical-align: top;">
          <label for="productosSeleccionados" style="display: block;">Productos seleccionados</label>
          <TextArea id="productosSeleccionados" :autoResize="true" rows="5" cols="90" type="text"
            v-model="this.productosNombres" :disabled="true" style="width: 350px;" />
        </div>
      </div>
      <p_dialog header="Selecciona los productos" v-model:visible="displayDialogPedidos"
        :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '50vw' }">
        <template #footer>
          <ProductoSeleccionableDatatable ref="productoSeleccionableDatatable"
            @productosSeleccionados="onProductosSeleccionados" />
          <p:commandButton label="No" icon="pi pi-times" @click="closeDialogPedidos" class="p-button-text" />
          <p:commandButton label="Sí" icon="pi pi-check" @click="closeDialogPedidos" autofocus />
        </template>
      </p_dialog>


      <div style="display: inline-block; margin-right: 10px; vertical-align: middle;">
        <label for="direccionEnvio" style="display: block;">Dirección de envío</label>
        <p:inputText id="direccionEnvio" type="text" v-model="this.editedRow.direccionEnvio" :disabled="isDisabled"
          style="width: 200px;" />
      </div>
      <div style="display: inline-block; margin-right: 10px; vertical-align: middle;">
        <label for="precioTotal" style="display: block;">Precio total</label>
        <p:inputText id="precioTotal" type="number" v-model="this.editedRow.precioTotal" :disabled="isDisabled"
          style="width: 200px;" />
      </div>
      <div style="display: inline-block; margin-right: 10px; vertical-align: top;">
        <label for="observaciones" style="display: block;">Observaciones</label>
        <TextArea id="observaciones" :autoResize="true" rows="5" cols="90" type="text"
          v-model="this.editedRow.observaciones" :disabled="isDisabled" style="width: 350px;" />
      </div>

    </div>
  </p_panel>

  <div v-if="this.roles.includes('SUPER_USER')">
    <p_panel style="margin-bottom: 20px;margin: 0 auto; width: 80%">
      <div class="center-buttons" style="margin: 0 auto; width: 80%; text-align: center;">
        <p:commandButton style="margin-right: 10px;" label="Nuevo" @click="create" class="p-button-success mr-2"
          icon="pi pi-plus"></p:commandButton>
        <p:commandButton style="margin-right: 10px;" label="Guardar" @click="save" icon="pi pi-save" update="nombre">
        </p:commandButton>
        <p:commandButton style="margin-right: 10px;" label="Eliminar" @click="remove" class="p-button-danger"
          icon="pi pi-trash"></p:commandButton>
        <p:commandButton style="margin-right: 10px;" label="Refrescar" @click="getAll" class="p-button-danger"
          icon="pi pi-refresh"></p:commandButton>
      </div>
    </p_panel>

  </div>
  <p_toast></p_toast>
</template>


<script>

import { mapGetters } from 'vuex';

import { FilterMatchMode } from 'primevue/api';
import PedidoService from '@/service/PedidoService';
import ProductoSeleccionableDatatable from './ProductoSeleccionableDatatable.vue'
export default {
  name: 'PedidoDatatable',
  components: {
    ProductoSeleccionableDatatable
  },
  data() {
    return {
      pedidos: null,
      productosNombres: [],
      selectedRow: null,
      editedRow: {
        id: null,
        estado: null,
        productos: null,
        precioTotal: null,
        direccionEnvio: null,
        metodoDePago: null,
        numSeguimiento: null,
        observaciones: null,
      },
      isDisabled: true,
      filters: null,
      metodosDePago: null,
      estados: null,
      displayDialogPedidos: false,


    }
  },
  pedidoService: null,
  created() {
    console.log("created");
    this.pedidoService = new PedidoService();
    this.initFilters();
    this.metodosDePago = ["Tarjeta", "Paypal", "Bizum"];
  },
  computed: {
    ...mapGetters({
      username: 'username',
      keycloakToken: 'keycloakToken',
      keycloakTokenParsed: 'keycloakTokenParsed',
      axiosConfig: 'axiosConfig',
      roles: 'roles',
    })
  },
  mounted() {
    console.log("mounted");
    if (this.keycloakToken != null) {
      this.getAll();
    }

  },
  watch: {
    keycloakToken: function (val) {
      if (val) {
        this.pedidoService.getAll(this.axiosConfig).then(response => {
          this.pedidos = response.data;
        });

      }
    }
  },
  methods: {
    save() {
      try {
        this.pedidoService.save(this.editedRow, this.axiosConfig).then(() => {
          this.$toast.add({ severity: 'success', summary: 'Guardando', detail: 'REGISTRO CREADO CORRECTAMENTE. GUARDADO EN BASE DE DATOS', life: 3000 })
          this.getAll();
          this.isDisabled = true;
        })
          .catch((error) => {
            console.log('primer catch');
            console.log(error);
            if (error.response.status === 400) {
              const errorMessage = error.response.data;
              this.$toast.add({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
            }
          });
      } catch (error) {
        console.log('segundo catch');
        console.log(error);
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el registro. Por favor, inténtalo de nuevo más tarde.', life: 3000 });
      }
    },
    create() {
      this.isDisabled = false;
      console.log('Hola create')
      this.editedRow = {
        id: null,
        estado: null,
        productos: null,
        precioTotal: null,
        direccionEnvio: null,
        metodoDePago: null,
        numSeguimiento: null,
        observaciones: null,
      };

    },
    remove() {
      try {
        this.pedidoService.remove(this.editedRow.id, this.axiosConfig).then(() => {
          this.$toast.add({ severity: 'success', summary: 'Eliminando', detail: 'REGISTRO ELIMINADO CORRECTAMENTE. BORRADO EN BASE DE DATOS', life: 3000 })
          this.getAll();
          this.isDisabled = true;
        });
      } catch (error) {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el registro. Por favor, inténtalo de nuevo más tarde.', life: 3000 });
      }
    },
    getAll() {
      this.pedidoService.getAll(this.axiosConfig).then(response => {
        this.pedidos = response.data;
      });
    },
    onRowSelect(event) {
      this.editedRow = Object.assign({}, event.data);
      this.isDisabled = false;
      this.productosNombres = event.data.productos.map(producto => producto.nombre).join(", ");
    },
    initFilters() {
      this.filters = {
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'numSeguimiento': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'metodoDePago': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'estado.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'precioTotal': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'direccionEnvio': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'observaciones': { value: null, matchMode: FilterMatchMode.CONTAINS },
      }
    },
    openDialogPedidos() {
      this.displayDialogPedidos = true;
    },
    closeDialogPedidos() {
      this.$refs.productoSeleccionableDatatable.emitProductosSeleccionados();
      this.displayDialogPedidos = false;
    },

    onProductosSeleccionados(productosSeleccionados) {
      this.editedRow.productos = productosSeleccionados;
    }

  }

}

</script>

<style lang="scss" scoped>
::v-deep(.p-datatable.p-datatable-pedidos) {
  .p-datatable-header {
    padding: 1rem;
    text-align: left;
    font-size: 1.5rem;
  }

  .p-paginator {
    padding: 1rem;
  }

  .p-datatable-thead>tr>th {
    text-align: left;
  }

  .p-datatable-tbody>tr>td {
    cursor: auto;
  }

  .p-dropdown-label:not(.p-placeholder) {
    text-transform: uppercase;
  }
}

.panel-flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
}

.panel-flex>div {
  flex-basis: calc(25% - 10px);
  margin-right: 10px;
  margin-bottom: 20px;
}
</style>