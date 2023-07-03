<template>
    <div>
        <GenericCRUD @elementosSeleccionados="onElementosDialogSeleccionados" :columns="crudColumns"
            :pathListDatatable="pathListDatatable" :beforeInsert="beforeInsert" :rowSelectListener="rowSelectListener"
            :editedRow="editedRow" :header="header" :crudInputs="crudInputs" :crudButtons="crudButtons"
            :service="pedidoService">
        </GenericCRUD>

    </div>
    <p_toast></p_toast>
</template>
  
<script>
import GenericCRUD from './GenericCRUD.vue';
import PedidoService from '@/service/PedidoService';


export default {
    components: {
        GenericCRUD,

    },
    data() {
        /*
        const options = [
            { label: "Opción 1", value: "opcion1" },
            { label: "Opción 2", value: "opcion2" },
            { label: "Opción 3", value: "opcion3" },
            { label: "Opción 4", value: "opcion4" },
        ];*/
        return {

            /************  Datatatble  ******************/
            crudColumns: [
                { title: 'ID', field: 'id' },
                { title: 'Nº de seguimiento', field: 'numSeguimiento' },
                { title: 'Método de pago', field: 'metodoDePago' },
                { title: 'Estado', field: 'estado.nombre' },
                { title: 'Precio total', field: 'precioTotal' },
                { title: 'Dirección de envío', field: 'direccionEnvio' },
                { title: 'Observaciones', field: 'observaciones' },
                { title: 'Fecha del pedido', field: 'fechaPedido' },
            ],
            pathListDatatable: 'api/pedido/',
            editedRow: {
                id: null,
                estado: null,
                productos: [],
                precioTotal: null,
                direccionEnvio: null,
                metodoDePago: null,
                numSeguimiento: null,
                fechaCreacion: new Date(),
                observaciones: null,

            },
            header: "Lista de Pedidos",

            /************  Panel inputs  ******************/

            selectedPedidosUnoList: [],
            selectedPedidosDosList: [],
            crudInputs: [
                { label: 'Nº de seguimiento', value: 'numSeguimiento', component: 'p:inputText' },
                {
                    label: 'Método de pago',
                    value: 'metodoDePago',
                    component: 'p:selectOneMenu',
                    options: [
                        { label: 'Paypal', value: 'Paypal' },
                        { label: 'Bizum', value: 'Bizum' },
                        { label: 'Tarje de crédito', value: 'Tarjeta de crédito' },
                    ],

                },
                {
                    id: 'idEstado',
                    label: 'Selecciona un estado',
                    value: 'estado',
                    customValue: true,
                    component: 'p:selectOneMenu',
                    pathList: "/api/estado/"

                },

                {
                    id: 'idDialogproductosUno',
                    label: 'Selecciona productos',
                    component: 'ZDialog',
                    zDialogData: [],
                    zDialogColumns: [ //agregar las columnas aquí
                        { field: 'id', header: 'ID' },
                        { field: 'nombre', header: 'Nombre' },
                        { field: 'descripción', header: 'Descripción' },
                        { field: 'enStock', header: 'En stock' },
                    ],
                    localLabelDialogButton: 'Selecciona productos uno',
                    pathList: "/api/product/",
                    header: "Lista de Productos",
                },

                { label: 'Dirección de envío', value: 'direccionEnvio', component: 'p:inputText' },
                { label: 'Precio total', value: 'precioTotal', component: 'p:inputText' },
                { label: 'Observaciones', value: 'observaciones', component: 'TextArea' },
                { label: 'Fecha del pedido', value: 'fechaPedido', component: 'p_calendar' },
                {
                    label: 'Pedido caro',
                    value: 'esPedidoCaro',
                    component: 'p:triStateCheckbox'
                },

                {
                    id: 'idProducto',
                    label: 'Selecciona varios productos',
                    value: 'productos',
                    component: 'p:selectCheckBoxMenu',
                    pathList: "/api/product/"

                },
                /*
                {
                    label: 'Estado',
                    value: 'estadoDos',
                    component: 'p:selectOneMenu',
                    options: [
                        { label: 'Opción 1', value: 'opcion1' },
                        { label: 'Opción 2', value: 'opcion2' },
                        { label: 'Opción 3', value: 'opcion3' },
                        { label: 'Opción 4', value: 'opcion4' }
                    ],

                },
                */

            ],
            /************  Botones  ******************/
            crudButtons: [
                {
                    label: 'Nuevo',
                    onClick: "create",
                    icon: 'pi pi-plus',
                    className: 'p-button-success mr-2',
                    component: 'p:commandButton',
                },
                {
                    label: 'Guardar',
                    onClick: "save",
                    icon: 'pi pi-save',
                    className: '',
                    component: 'p:commandButton',
                },
                {
                    label: 'Eliminar',
                    onClick: "remove",
                    icon: 'pi pi-trash',
                    className: 'p-button-danger',
                    component: 'p:commandButton',
                },

            ],
            /*
            crudInputs: [
                { label: 'Nombre', value: 'name', component: 'p:inputText' },
                { label: 'Email', value: 'email', component: 'p:inputText' },
                //selectOneMenu proporcionando lista directamente como variable en el cuerpo de data
                {
                    label: 'Estado con lista como variable',
                    value: 'estadoUno',
                    component: 'p:selectOneMenu',
                    options

                },    
            ]*/




        }


    },
    beforeCreate() {
        this.pedidoService = new PedidoService();


    },

    mounted() {
        console.log('mounted padre');
    },

    methods: {
        onElementosDialogSeleccionados(elementosSeleccionados, idDialog, localEditedRow) {
            if (idDialog === 'idDialogproductosUno') {
                this.selectedPedidosUnoList = elementosSeleccionados;
                localEditedRow.productos = this.selectedPedidosUnoList;
            } else if (idDialog === 'idDialogproductosDos') {
                this.selectedPedidosDosList = elementosSeleccionados;
                localEditedRow.productos = this.selectedPedidosDosList;
            }
        },

        rowSelectListener(callback, localEditedRow) {
            console.log('RowSelectListener del padre');
            console.log('localEditedRow del padre', localEditedRow);
            callback();




        }
        ,

        beforeInsert(callback) {
            // aquí se hace todo el proceso previo al guardado
            // cuando termine, se llama a la función de callback
            console.log('BeforeSave del padre');
            callback();
        }
    }



}
</script>