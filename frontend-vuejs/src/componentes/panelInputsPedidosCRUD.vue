<template>
    <h2>Panel stateRefs</h2>
    <h4>{{ stateRefs.editedRow }}</h4>
    <h2>Panel state</h2>
    <h4>{{ state.editedRow }}</h4>
    <p_panel style="margin-bottom: 20px;margin: 0 auto; width: 80%">

        <div class="panel-flex" style="margin-bottom: 20px;margin: 0 auto; width: 80%">

            <div style="display: inline-block; margin-right: 10px; vertical-align: middle;">
                <label for="numSeguimiento" style="display: block;">Nº de seguimiento</label>
                <p:inputText id="numSeguimiento" type="text" v-model="stateRefs.editedRow.numSeguimiento" :disabled="true"
                    style="width: 200px;" />
            </div>

            <div style="display: inline-block; margin-right: 10px; vertical-align: middle;">
                <label for="metodoDePago" style="display: block;">Método de pago</label>
                <p:selectOneMenu id="metodoDePago" v-model="stateRefs.editedRow.metodoDePago" :disabled="state.disabled"
                    style="width: 200px;" :options="metodosDePago" placeholder="Selecciona un método de pago" />
            </div>

            <div style="display: inline-block; margin-right: 10px; vertical-align: middle;">
                <label for="estado" style="display: block;">Estado</label>
                <p:selectOneMenu id="estado" v-model="stateRefs.editedRow.estado" :disabled="state.disabled"
                    style="width: 200px;" optionLabel="nombre" placeholder="Selecciona un estado" :options="estados" />
            </div>



            <div style="display: inline-block; margin-right: 10px; vertical-align: middle;">
                <label for="direccionEnvio" style="display: block;">Dirección de envío</label>
                <p:inputText id="direccionEnvio" type="text" v-model="stateRefs.editedRow.direccionEnvio"
                    :disabled="state.disabled" style="width: 200px;" />
            </div>
            <div style="display: inline-block; margin-right: 10px; vertical-align: middle;">
                <label for="precioTotal" style="display: block;">Precio total</label>
                <p:inputText id="precioTotal" type="number" v-model="stateRefs.editedRow.precioTotal"
                    :disabled="state.disabled" style="width: 200px;" />
            </div>
            <div style="display: inline-block; margin-right: 10px; vertical-align: top;">
                <label for="observaciones" style="display: block;">Observaciones</label>
                <TextArea id="observaciones" :autoResize="true" rows="5" cols="90" type="text"
                    v-model="stateRefs.editedRow.observaciones" :disabled="state.disabled" style="width: 350px;" />
            </div>

        </div>
    </p_panel>

    <div v-if="this.roles.includes('SUPER_USER')">
        <p_panel style="margin-bottom: 20px;margin: 0 auto; width: 80%">
            <div class="center-buttons" style="margin: 0 auto; width: 80%; text-align: center;">
                <p:commandButton style="margin-right: 10px;" label="Nuevo" @click="beforeCreate"
                    class="p-button-success mr-2" icon="pi pi-plus"></p:commandButton>
                <p:commandButton style="margin-right: 10px;" label="Guardar" @click="beforeSave" icon="pi pi-save"
                    update="nombre">
                </p:commandButton>
                <p:commandButton style="margin-right: 10px;" label="Eliminar" @click="beforeDelete" class="p-button-danger"
                    icon="pi pi-trash"></p:commandButton>

            </div>
        </p_panel>

    </div>
</template>
<script>
import { watchEffect, computed, ref, toRefs } from 'vue';
import { useStore } from 'vuex';

export default {
    components: {

    },
    props: {
        state: {
            type: Object,
            required: true
        },
        estados: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    setup(props) {
        const stateRefs = toRefs(props.state);


        const checked = ref(null);
        const store = useStore();

        const roles = computed(() => store.getters.roles);

        const metodosDePago = [
            'Paypal',
            'Bizum',
            'Tarje de crédito'
        ];


        const beforeCreate = () => {
            // Lógica antes de crear un registro
        };

        const beforeSave = () => {
            // Lógica antes de guardar un registro
        };

        const beforeDelete = () => {
            // Lógica antes de eliminar un registro
        };

        watchEffect(() => {
            // Esto forzará la actualización del componente cada vez que cambie stateRefs.editedRow
            console.log('watchEffect')
        });

        return {
            stateRefs,
            checked,
            beforeCreate,
            beforeSave,
            beforeDelete,
            roles,
            metodosDePago,
        };

    },
};
</script>
  

<style lang="scss" scoped>
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