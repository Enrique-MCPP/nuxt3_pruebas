export default {

  data() {
    
    return {
      nombre: 'Soy una variable del mixin'
    }
  },
  mounted() {
    // Llama al método rowSelectListener del mixin en el evento 'mounted'
    console.log('mounted del mixin');
  },
  methods: {
    rowSelectListener() {
      // Lógica del método rowSelectListener
      // ...
      console.log('Rowselect del mixin ');
      // Modifica la variable 'nombre' del mixin
      this.nombre = '¡La variable del mixin ha sido modificada!';

      // Busca un método anotado con @RowSelect en el componente
      const rowSelectMethod = this.$options.methods['@RowSelect'];
      if (typeof rowSelectMethod === 'function') {
        // Ejecuta el método @RowSelect en el componente
        rowSelectMethod();
      }else{
        console.log('No se ha encontrado método con @RowSelect')
      }
    }
  }
}
