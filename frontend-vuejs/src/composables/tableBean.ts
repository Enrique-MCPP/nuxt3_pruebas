import { reactive, nextTick, onMounted } from 'vue';

export function tableBean(service, axiosConfig, toast) {

  const state = reactive({
    editedRow: {},
    selectedRow: {},
    list: [],
    disabled: false,
  });


  const list = async () => {
    console.log('Entrando en list de tableBean')
    try {
      const response = await service.getAll(axiosConfig);
      state.list = response.data;
    } catch (error) {
      console.log(error);
    }
  };


  onMounted(list);

  const rowSelectListener = async (selectedRow) => {
    console.log('Dentro del rowSelectListener del composable');
    state.selectedRow = selectedRow;
    state.editedRow = { ...selectedRow };
    await nextTick();

    console.log('SelectedRow:', state.selectedRow);
    console.log('EditedRow:', state.editedRow);
  };

  const create = () => {
    state.disabled = false;
    state.editedRow = null;
  };


  const save = async () => {
    console.log('Dentro del save del composable')
    console.log(state.editedRow);
    try {
      await service.save(state.editedRow, axiosConfig);
      state.disabled = true;
      await nextTick();
      state.list = await service.getAll(axiosConfig);
      toast.add({
        severity: 'success',
        summary: 'Guardando',
        detail: 'REGISTRO CREADO CORRECTAMENTE. GUARDADO EN BASE DE DATOS',
        life: 3000
      });
    } catch (error) {
      console.log('primer catch');
      console.log(error);
      showErrorToast(error);
    }
  };

  const remove = async (rowToDelete) => {
    try {
      await service.remove(rowToDelete.id, axiosConfig);
      state.list = await service.getAll(axiosConfig);
      state.disabled = true;
    } catch (error) {
      console.log(error);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar el registro. Por favor, inténtalo de nuevo más tarde.',
        life: 3000
      });
    }
  };

  const showErrorToast = (error) => {
    if (error.response.status === 400) {
      const errorMessage = error.response.data;
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000
      });
    } else {
      console.log('segundo catch');
      console.log(error);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo guardar el registro. Por favor, inténtalo de nuevo más tarde.',
        life: 3000
      });
    }
  }

  return {
    state,
    save,
    remove,
    create,
    list,
    rowSelectListener
  };
}
