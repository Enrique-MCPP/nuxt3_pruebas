import axios from "axios";

export default class EstadoService {

    path = "/api/estado/";

    getAll(config) {
        return axios.get(this.path, config);
    }
    save(pedido, config) {
        return axios.post(this.path, pedido, config);
    }

    remove(id, config) {
        return axios.delete(`${this.path}${id}`, config);
    }

    getEvent(callBack, nombre) {
        nombre = 'Kike crack';
        console.log('Hola en pedidoService ', nombre)
        console.log('Hola en pedidoService '+ nombre)
        callBack();
    }


}