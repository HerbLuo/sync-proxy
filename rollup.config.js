export default [{
  input: 'tsc-out/index.js',
  output: [{
    file: 'lib/index.esm.js',
    format: 'es',
  }, {
    file: 'lib/index.js',
    format: 'cjs',
  }, {
    file: 'lib/index.umd.js',
    format: 'umd',
    name: 'SyncProxy',
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
