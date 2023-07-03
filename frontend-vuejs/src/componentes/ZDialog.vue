<template>
    <p:commandButton id="ButtonDialog" :label="this.labelDialogButton" icon="pi pi-external-link" @click="openDialogPedidos"
        style="vertical-align: middle;" />
    <p_dialog header="Selecciona los productos" v-model:visible="displayDialogPedidos"
        :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '50vw' }">
        <template #footer>
            <div style="margin: 0 auto; width: 80%">
                <p_panel :header="header">
                    <p:dataTable ref="datatableDialog" :value="data" :paginator="true" :rows="10" v-model:selection="selectedEditedRowList"
                        class="p-datatable-pedidos" @row-click="onRowSelect" dataKey="id"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        :rowsPerPageOptions="[10, 20, 50]" responsiveLayout="scroll" filterDisplay="row"
                        :globalFilterFields="globalFilterFields" v-model:filters="filters"
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
                            No hay elementos disponibles.
                        </template>
                        <template #loading>
                            Cargando elementos. Por favor, espera.
                        </template>
                        <p_column selection-mode="multiple" header-style="width: 3em"></p_column>
                        <p_column v-for="column in columns" :field="column.field" :header="column.header"
                            :key="column.field" :ref="column.field" :sortable="true">
                            <template #filter="{ filterModel, filterCallback }">
                                <p:inputText type="text" v-model="filterModel.value" @keyup="filterCallback()"
                                    class="p-column-filter" :placeholder="'Buscar por ' + column.header" />
                            </template>
                        </p_column>

                    </p:dataTable>
                </p_panel>
            </div>
            <p:commandButton label="No" icon="pi pi-times" @click="closeDialogPedidos" class="p-button-text" />
            <p:commandButton label="Sí" icon="pi pi-check" @click="closeDialogPedidos" autofocus />


        </template>
    </p_dialog>
    <p_card>
        <template #title>
            Productos Seleccionados
        </template>
        <template #content>
            <ul class="p-list">
                <li v-for="(item, index) in selectedEditedRowList" :key="index">
                    {{ item.nombre }}
                </li>
            </ul>
        </template>

    </p_card>
</template>
  
<script>
import { FilterMatchMode } from 'primevue/api';
import { mapGetters } from 'vuex';
export default {
    name: 'zDialog',
    props: {
        columns: {
            type: Array,
            required: true
        },
        data: {
            type: Array,
            required: true
        },
        header: {
            type: String,
            default: "Lista de elementos",
            required: true
        },
        labelDialogButton: {
            type: String,
            default: "Lista de elementos",
            required: true
        },
        idDialog: {
            type: String,

            required: true
        },


    },
    emits: ['elementosSeleccionados'],
    data() {

        return {
            filters: {},
            selectedRow: null,
            selectedEditedRowList: [],
            customValueInput: null,
            displayDialogPedidos: false,
            idDialogLocal: null

        }

    },

    computed: {
        globalFilterFields() {
            return [
                'global',
                ...this.columns.map((column) => column.field)
            ];
        },
        currentPageReportTemplate() {
            return `Mostrando {first} a {last} de ${this.data.length} pedidos`;
        },
        ...mapGetters({
            username: 'username',
            keycloakToken: 'keycloakToken',
            keycloakTokenParsed: 'keycloakTokenParsed',
            axiosConfig: 'axiosConfig',
            roles: 'roles',
        }),

    },
    async created() {
        console.log("created");
        this.initFilters();
        this.idDialogLocal = this.idDialog;
    },
    methods: {
        onRowSelect() {


        },
        initFilters() {
            const filters = {
                'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
            };
            this.columns.forEach((column) => {
                filters[column.field] = {
                    value: null,
                    matchMode: FilterMatchMode.CONTAINS
                };
            });
            this.filters = filters;
        },

        openDialogPedidos() {
            this.displayDialogPedidos = true;
        },
        closeDialogPedidos() {


            this.$emit('elementosSeleccionados', this.selectedEditedRowList, this.idDialogLocal);
            this.displayDialogPedidos = false;
        },


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