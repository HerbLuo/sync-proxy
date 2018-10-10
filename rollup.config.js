import typescript from 'typescript'
import rollupTypescript from 'rollup-plugin-typescript'

export default [{
  input: 'index.ts',
  output: [{
    file: 'lib/index.esm.js',
    format: 'es',
  }, {
    file: 'lib/index.js',
    format: 'cjs',
  }, {
    file: 'lib/index.umd.js',
    format: 'umd',
    name: 'QxzLApi',
    globals: {
      tslib: 'tslib',
    }
  }],
  plugins: [
    rollupTypescript({
      typescript
    }),
  ],
  external: [
    'tslib'
  ]
}]
