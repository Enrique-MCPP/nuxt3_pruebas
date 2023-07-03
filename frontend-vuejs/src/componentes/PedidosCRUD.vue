<template>
  <GenericDatatable :columns="crudColumns" :header="header" :state="state">
  </GenericDatatable>

  <panelInputsPedidosCRUD :state="state" :estados="estados"></panelInputsPedidosCRUD>

  <p_toast></p_toast>
</template>

<script>

import { useStore } from 'vuex';
import { tableBean } from '@/composables/tableBean';
import PedidoService from '@/service/PedidoService';
import EstadoService from '@/service/EstadoService';
import { computed, ref, provide } from 'vue';
import GenericDatatable from './GenericDatatable.vue';
import panelInputsPedidosCRUD from './panelInputsPedidosCRUD.vue';
import { rowSelectListenerPedidos, beforeSave, beforeCreate, beforeDelete } from '@/utils/tableUtils.js';
import ToastService from 'primevue/toastservice';

export default {
  components: {
    GenericDatatable,
    panelInputsPedidosCRUD
  },
  setup() {
    provide('rowSelectListenerPedidos', (selectedRow) => rowSelectListenerPedidos(selectedRow, rowSelectListener));


    provide('beforeSave', (editedRow) => beforeSave(editedRow, save));
    provide('beforeCreate', () => beforeCreate(create));
    provide('beforeDelete', (editedRow) => beforeDelete(editedRow, remove));

    const store = useStore();
    const axiosConfig = computed(() => store.getters.axiosConfig);
    const pedidoService = new PedidoService();
    const estadoService = new EstadoService();


    const { state, list, create, save, remove, rowSelectListener } = tableBean(pedidoService, axiosConfig.value, ToastService);



    const header = "Lista de Pedidos";
    const crudColumns = [
      { title: 'ID', field: 'id' },
      { title: 'Nº de seguimiento', field: 'numSeguimiento' },
      { title: 'Método de pago', field: 'metodoDePago' },
      { title: 'Estado', field: 'estado?.nombre' },
      { title: 'Precio total', field: 'precioTotal' },
      { title: 'Dirección de envío', field: 'direccionEnvio' },
      { title: 'Observaciones', field: 'observaciones' },
      { title: 'Fecha del pedido', field: 'fechaPedido' },
    ];
    /**Obtener los estados para el selectOnemenu de estados */
    const estados = ref([]);
    const getEstados = async () => {
      const response = await estadoService.getAll(axiosConfig.value);
      estados.value = response.data;
    }
    if (estados.value.length === 0) {
      getEstados();
    }


    return {
      state,
      list,
      crudColumns,
      rowSelectListener,
      header,
      save,
      remove,
      create,
      estados,
    };
  }


};
</script>
