import { reactive } from 'vue';


const state = reactive({
  editedRow: {
    id: 3,
    estado: "sin guardar",
    productos: [],
    precioTotal: 15,
    direccionEnvio: "otro lado",
    metodoDePago: "paypal",
    numSeguimiento: "otro",
    fechaCreacion: new Date(),
    observaciones: "Primer editedRow al composable",
  },
  selectedRow: null,
  list: [],
  isDisabled: false,
});
export function useTableBean(service, axiosConfig) {
  const stateUno = reactive({
    myObject: {
      prop1: 'valor1',
      prop2: 'valor2',
    },
  });

  const updateMyObject = () => {
    stateUno.myObject.prop1 = 'nuevo valor';
  };
  const setEditedRow = (newValue) => {
    state.editedRow = newValue
  }

  const create = () => {
    state.isDisabled = false;
    state.editedRow = null;
  };

  const getAll = async () => {
    try {
      const response = await service.getAll(axiosConfig);
      state.list = response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const save = async () => {
    console.log('Dentro del save del composable')
    console.log(state.editedRow);

    setEditedRow({
      id: 2,
      estado: "suspenso",
      productos: [],
      precioTotal: 15,
      direccionEnvio: "otro lado",
      metodoDePago: "paypal",
      numSeguimiento: "otro",
      fechaCreacion: new Date(),
      observaciones: "Primer editedRow al composable",
    });

  };



  const remove = async (rowToDelete) => {
    try {
      await service.remove(rowToDelete.id, axiosConfig);
      state.list = await getAll();
      state.isDisabled = true;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    state,
    stateUno,
    updateMyObject,
    save,
    remove,
    create,
    getAll,
    setEditedRow,

  };
}
