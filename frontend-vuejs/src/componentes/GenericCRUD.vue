<template>
    <div style="margin: 0 auto; width: 80%">
        <p_panel :header="header">
            <p:dataTable :value="localList" :paginator="true" :rows="10" v-model:selection="selectedRow"
                class="p-datatable-pedidos" @row-click="onRowSelect" selectionMode="single" dataKey="id"
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
    <p_panel style="margin-bottom: 20px;margin: 0 auto; width: 80%">
        <div class="panel-flex" style="margin-bottom: 20px;margin: 0 auto; width: 80%">
            <div v-for="(input, index) in crudInputs" :key="index"
                style="display: inline-block; margin-right: 10px; vertical-align: middle;">

                <label :for="input.value" style="display: block;">{{ input.label }}</label>
                <component v-if="input.component !== 'ZDialog'" :is="input.component" :options="input.options"
                    :option-label="(option) => option.label" :option-value="(option) => option.value" :disabled="isDisabled"
                    v-model="localEditedRow[input.value]" style="width: 200px;">
                </component>

                <ZDialog ref="zDialog" v-else :data="input.zDialogData" :columns="input.zDialogColumns"
                    :labelDialogButton="input.localLabelDialogButton" :header="input.header"
                    @elementosSeleccionados="onElementosSeleccionados" :idDialog="input.id">
                </ZDialog>

            </div>

        </div>
    </p_panel>
    <p_panel style="margin-bottom: 20px;margin: 0 auto; width: 80%">
        <div class="center-buttons" style="margin: 0 auto; width: 80%; text-align: center;">

            <div v-for="(input, index) in crudButtons" :key="index"
                style="display: inline-block; margin-right: 10px; vertical-align: middle;">
                <p:commandButton :is="input.component" :label="input.label"
                    @click="onClick(input.onClick, () => $emit(input.onClick))" :class="input.className" :icon="input.icon">
                </p:commandButton>
            </div>

        </div>
    </p_panel>


    <h2>
        <p>El valor del estado seleccionado es: {{ localEditedRow["estadoUno"] }}</p>
        <p>El valor del producto seleccionado es: {{ localEditedRow["producto"] }}</p>
        <p>El valor de los productos seleccionados es: {{ localEditedRow["productos"] }}</p>
        <p>El valor del nombre es: {{ localEditedRow["name"] }}</p>

        <p>El valor del método de pago es: {{ localEditedRow["metodoDePago"] }}</p>

        <p>El valor de la fecha de creación es: {{ localEditedRow["fechaCreacion"] }}</p>

        <p>El pedido es caro: {{ localEditedRow["esPedidoCaro"] }}</p>


    </h2>
</template>
  
<script>
import { FilterMatchMode } from 'primevue/api';
import { mapGetters } from 'vuex';
import axios from "axios";
import ZDialog from './ZDialog.vue';
import PedidoService from '@/service/PedidoService';

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
        editedRow: {
            type: Object,
            default: null
        },
        crudInputs: {
            type: Object,
            default: function () {
                return {}
            }
        },
        crudButtons: {
            type: Array,
            required: true
        },

        beforeInsert: {
            type: Function,
            required: true,
        },
        service: {
            type: Object,
            required: true
        },
        rowSelectListener: {
            type: Function,
            required: true,
        },




    },
    components: {
        ZDialog,

    },
    emits: ['elementosSeleccionados', 'save', 'select', 'eventService'],
    data() {

        return {
            filters: {},
            selectedRow: null,
            localEditedRow: Object.assign({}, this.editedRow),
            isDisabled: true,
            localList: [],
            checked: null,




        }

    },
    beforeCreate() {
        this.pedidoService = new PedidoService();
    },
    watch: {
        editedRow: {
            handler: function (newVal) {
                this.localEditedRow = Object.assign({}, newVal);
            },
            deep: true
        },
    }
    ,
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
        currentSelection() {
            return this.selectedRow[0] || {};
        },
        ...mapGetters({
            username: 'username',
            keycloakToken: 'keycloakToken',
            keycloakTokenParsed: 'keycloakTokenParsed',
            axiosConfig: 'axiosConfig',
            roles: 'roles',
        }),
        getValue() {
            return (value) => this.localEditedRow[value];
        }

    },
    created() {
        console.log("created");
        this.initFilters();
        this.getAll();
    },
    mounted() {
        console.log('mounted hijo');
        // Recorre los inputs y si existe pathList, realiza una solicitud GET para obtener las opciones del selectOneMenu
        this.crudInputs.forEach(async (input) => {
            if (input.component.includes('select') && input.pathList) {
                const response = await axios.get(input.pathList, this.axiosConfig);
                const parsedData = response.data;
                input.options = parsedData.map((item) => ({
                    label: item.nombre,
                    value: item,
                }));
            } else if (input.component.includes('ZDialog') && input.pathList) {
                const response = await axios.get(input.pathList, this.axiosConfig);
                input.zDialogData = response.data;
                console.log(input.zDialogData);
            }
        });
    },
    methods: {
        onRowSelect(event) {
            this.localEditedRow = Object.assign({}, event.data);
            console.log('localEditedRow del hijo', this.localEditedRow);
            this.isDisabled = false;
            this.rowSelectListener(() => {

                if (typeof handleRowSelection === 'function') {
                    this.handleRowSelection();
                }

            }, this.localEditedRow);
            console.log('Paco')
            let nombrePrueba = 'Kike'
            console.log('El nombre prueba en rowselect es ', nombrePrueba)
            console.log('El nombre prueba en rowselect es ' + nombrePrueba)

            this.service.getEvent(() => {

                if (typeof handleRowSelection === 'function') {
                    this.handleEventPrueba();
                }

            }, nombrePrueba);

            console.log('El nombre prueba en rowselect ahora es es ' + nombrePrueba)
        },
        handleRowSelection() {
            console.log('Row selected!');
        },
        handleEventPrueba() {
            console.log('Row event prueba!');
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
        onElementosSeleccionados(elementosSeleccionados, idDialog) {

            this.$emit('elementosSeleccionados', elementosSeleccionados, idDialog, this.localEditedRow);

        },
        onClick(action, callback) {
            if (action === 'save') {
                console.log('onClick del hijo antes de llamar al beforesave del padre');
                this.beforeInsert(() => {
                    console.log('beforeInsert callback del hijo');
                    callback();
                });
                this.save();
            } else if (action === 'remove') {
                this.remove();
            } else if (action === 'create') {
                this.create();
            }
        },
        save() {

            console.log(this.localEditedRow);

            try {
                this.service.save(this.localEditedRow, this.axiosConfig).then(() => {
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Guardando',
                        detail: 'REGISTRO CREADO CORRECTAMENTE. GUARDADO EN BASE DE DATOS',
                        life: 3000
                    });
                    this.getAll();
                    this.isDisabled = true;
                }).catch((error) => {
                    console.log('primer catch');
                    console.log(error);
                    if (error.response.status === 400) {
                        const errorMessage = error.response.data;
                        this.$toast.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: errorMessage,
                            life: 3000
                        });
                    }
                });
            } catch (error) {
                console.log('segundo catch');
                console.log(error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo guardar el registro. Por favor, inténtalo de nuevo más tarde.',
                    life: 3000
                });
            }
        },
        create() {
            this.isDisabled = false;
            console.log('Hola create')
            this.localEditedRow = {
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
                this.service.remove(this.localEditedRow.id, this.axiosConfig).then(() => {
                    this.$toast.add({ severity: 'success', summary: 'Eliminando', detail: 'REGISTRO ELIMINADO CORRECTAMENTE. BORRADO EN BASE DE DATOS', life: 3000 })
                    this.getAll();
                    this.isDisabled = true;
                });
            } catch (error) {
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el registro. Por favor, inténtalo de nuevo más tarde.', life: 3000 });
            }
        },
        async getAll() {
            let response;
            if (!this.$props.pathListDatatable) {
                response = await this.service.getAll(this.axiosConfig);

            } else {
                console.log('lo he conseguido')
                response = await this.axios.get(this.pathListDatatable, this.axiosConfig);
            }
            this.localList = response.data;

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