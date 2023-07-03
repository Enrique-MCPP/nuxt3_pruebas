import axios from "axios";

export default class ProductoService {

    path = "/api/product/";

    getAll(config) {
        return axios.get(this.path, config);
    }
    save(producto, config) {
        return axios.post(this.path, producto, config);
    }

    remove(id, config) {
        return axios.delete(`${this.path}${id}`, config);
    }

 
}