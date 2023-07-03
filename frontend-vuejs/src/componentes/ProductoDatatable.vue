<template>
  <div style="margin: 0 auto; width: 80%">
    <p_panel header="Productos disponibles">
      <p:dataTable :value="productos" :paginator="true" :rows="10" v-model:selection="selectedRow"
        class="p-datatable-productos" @row-click="onRowSelect" selectionMode="single" dataKey="id"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 20, 50]" responsiveLayout="scroll" filterDisplay="row" v-model:filters="filters"
        :globalFilterFields="['nombre', 'descripcion', 'precio']"
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
          No hay productos disponibles.
        </template>
        <template #loading>
          Cargando productos. por favor, espera.
        </template>
        <p_column field="nombre" header="Nombre" filterMatchMode="contains" ref="nombre" :sortable="true">
          <template #filter="{ filterModel, filterCallback }">
            <p:inputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"
              class="p-column-filter" placeholder="Buscar por nombre " />
          </template>
        </p_column>
        <p_column field="descripcion" header="Descripción" filterMatchMode="contains" ref="descripcion"
          :sortable="true">
          <template #filter="{ filterModel, filterCallback }">
            <p:inputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"
              class="p-column-filter" placeholder="Buscar por descripción " />
          </template>
        </p_column>
        <p_column field="precio" header="Precio" filterMatchMode="contains" ref="precio" :sortable="true">
          <template #filter="{ filterModel, filterCallback }">
            <p:inputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"
              class="p-column-filter" placeholder="Buscar por precio " />
          </template>
        </p_column>


      </p:dataTable>
    </p_panel>
  </div>

  <p_panel style="margin-bottom: 20px;margin: 0 auto; width: 80%">
    <div style="display: inline-block; margin-right: 10px;">
      <label for="nombre" style="display: block;">Nombre</label>
      <p:inputText id="nombre" type="text" v-model="this.editedRow.nombre" :disabled="isDisabled"
        style="width: 200px;" />
    </div>

    <div style="display: inline-block; margin-right: 10px;">
      <label for="descripcion" style="display: block;">Descripción</label>
      <p:inputText id="descripcion" type="text" v-model="this.editedRow.descripcion" :disabled="isDisabled"
        style="width: 200px;" />
    </div>

    <div style="display: inline-block; margin-right: 10px;">
      <label for="precio" style="display: block;">Precio</label>
      <p:inputText id="precio" type="number" v-model="this.editedRow.precio" :disabled="isDisabled"
        style="width: 200px;" />
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
import ProductoService from '@/service/ProductoService';
import { FilterMatchMode } from 'primevue/api';

export default {
  name: 'ProductoDatatable',
  data() {
    return {
      productos: [],
      selectedRow: {
        id: null,
        nombre: null,
        descripcion: null,
        precio: null
      },
      editedRow: {
        id: null,
        nombre: null,
        descripcion: null,
        precio: null
      },
      isDisabled: true,
      filters: null,
    }
  },
  productoService: null,
  created() {
    this.productoService = new ProductoService();
    this.initFilters();

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
    if (this.keycloakToken != null) {
      this.getAll();
    }

  },
  watch: {
    keycloakToken: function (val) {
      if (val) {
        this.productoService.getAll(this.axiosConfig).then(response => {
          this.productos = response.data;
        });
      }
    }
  },
  methods: {
    save() {
      try {
        this.productoService.save(this.editedRow, this.axiosConfig).then(() => {
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
        nombre: null,
        descripcion: null,
        precio: null
      }
    },
    remove() {
      try {
        this.productoService.remove(this.editedRow.id, this.axiosConfig).then(() => {
          this.$toast.add({ severity: 'success', summary: 'Eliminando', detail: 'REGISTRO ELIMINADO CORRECTAMENTE. BORRADO EN BASE DE DATOS', life: 3000 })
          this.getAll();
          this.isDisabled = true;
        });
      } catch (error) {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el registro. Por favor, inténtalo de nuevo más tarde.', life: 3000 });
      }
    },
    getAll() {
      this.productoService.getAll(this.axiosConfig).then(response => {
        this.productos = response.data;
      });
    },
    onRowSelect(event) {
      this.editedRow = Object.assign({}, event.data);
      this.isDisabled = false;
    },
    initFilters() {
      this.filters = {
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'descripcion': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'precio': { value: null, matchMode: FilterMatchMode.CONTAINS },
      }
    }

  }

}

</script>

<style lang="scss" scoped>
::v-deep(.p-datatable.p-datatable-productos) {
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
</style>