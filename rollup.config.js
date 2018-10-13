export default [{
  input: 'tsc-out/index.js',
  output: [{
    file: 'lib/index.esm.js',
    format: 'es',
  }, {
    file: 'lib/index.js',
    format: 'cjs',
    exports: 'named',
  }, {
    file: 'lib/index.umd.js',
    format: 'umd',
    name: 'QxzLApi',
    exports: 'named',
    globals: {
      tslib: 'tslib',
    }
  }],
  plugins: [
  ],
  external: [
    'tslib'
  ]
}]
