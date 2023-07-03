export const rowSelectListenerPedidos = async (selectedRow, rowSelectListener) => {
    console.log('rowselect del padre', selectedRow);
    await rowSelectListener(selectedRow);
    console.log('ha vuelto al rowselect del padre');
};

export const beforeSave = async (editedRow, save) => {
    console.log('beforeSave del padre', editedRow);
    await save(editedRow);
    console.log('ha vuelto al beforeSave del padre');
};

export const beforeCreate = (create) => {
    console.log('beforeCreate del padre');
    create();
    console.log('ha vuelto al beforeCreate del padre');
};

export const beforeDelete = async (editedRow, remove) => {
    console.log('beforeDelete del padre', editedRow);
    await remove(editedRow);
    console.log('ha vuelto al beforeDelete del padre');
};
