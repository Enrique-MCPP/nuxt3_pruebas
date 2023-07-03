// rollup.config.js
export default [
  {
    input: 'index.js',
    output: {
      file: 'cjs/index.js',
      format: 'cjs'
    }
  },
  {
    input: 'instance.js',
    output: {
      file: 'cjs/instance.js',
      format: 'cjs'
    }
  }
];