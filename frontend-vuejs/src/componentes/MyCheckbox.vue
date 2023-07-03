<template>
    <div>
      <label>{{ label }}</label>
      <input type="checkbox" v-model="localValue" @change="handleChange">
    </div>
  </template>
  
  <script>
  export default {
    props: {
      value: { // v-model value
        type: Boolean,
        required: true
      },
      label: { // label text
        type: String,
        required: true
      }
    },
    data() {
      return {
        localValue: null // local value for tri-state checkbox
      }
    },
    mounted() {
      this.localValue = this.value
    },
    methods: {
      handleChange() {
        if (this.localValue === null) {
          this.localValue = true
        } else if (this.localValue === true) {
          this.localValue = false
        } else {
          this.localValue = null
        }
        this.$emit('input', this.localValue)
      }
    }
  }
  </script>
  