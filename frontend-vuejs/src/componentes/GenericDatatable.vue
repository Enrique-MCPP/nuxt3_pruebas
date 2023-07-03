<template>
    <div style="margin: 0 auto; width: 80%">
        <p_panel :header="header">
            <p:dataTable :value="state.list" :paginator="true" :rows="10" v-model:selection="localSelectedRow"
                class="p-datatable-generic" @row-click="rowSelectListener" selectionMode="single" dataKey="id"
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
                <p_column v-for="column in columns" :field="column.field" :header="column.title" :key="column.field"
                    :ref="column.field" :sortable="true">
                    <template #filter="{ filterModel, filterCallback }">
                        <p:inputText type="text" v-model="filterModel.value" @keyup="filterCallback()"
                            class="p-column-filter" :placeholder="'Buscar por ' + column.title" />
                    </template>
                </p_column>

            </p:dataTable>
        </p_panel>
    </div>
</template>
  
<script>
import { FilterMatchMode } from 'primevue/api';
import { ref, computed, inject } from 'vue';


export default {
    props: {
        columns: {
            type: Array,
            required: true
        },
        pathListDatatable: {
            type: String,
            required: false
        },
        header: {
            type: String,
            default: "Lista de elementos"
        },
        crudInputs: {
            type: Object,
            default: () => ({})
        },
        state: {
            type: Object,
            required: true
        },
    },
    setup(props) {
        const filters = ref({});
        const rowSelectListener = inject('rowSelectListenerPedidos');
        const localSelectedRow = ref(null);


        function initFilters() {
            const filtersObj = {
                'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
            };
            props.columns.forEach((column) => {
                filtersObj[column.field] = {
                    value: null,
                    matchMode: FilterMatchMode.CONTAINS
                };
            });
            filters.value = filtersObj;
        }

        initFilters();

        const globalFilterFields = computed(() => {
            return [
                'global',
                ...props.columns.map((column) => column.field)
            ];
        });
        const currentPageReportTemplate = computed(() => {
            return `Mostrando {first} a {last} de ${props.list.length} pedidos`;
        });
        const onRowSelect = () => {
            //this.localSelectedRow = Object.assign({}, event.data);
            console.log('row select del datatable hijo')
            this.rowSelectListener(() => { this.localSelectedRow });
        }
        return {
            filters,
            localSelectedRow,
            globalFilterFields,
            currentPageReportTemplate,
            rowSelectListener,
            onRowSelect

        };
    }
};
</script>
  

<style lang="scss" scoped>
::v-deep(.p-datatable.p-datatable-generic) {
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