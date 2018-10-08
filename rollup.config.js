import typescript from 'typescript'
import { uglify } from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import rollupTypescript from 'rollup-plugin-typescript'

const uglifyES = uglify({
  compress: {
    drop_console: true
  }
}, minify)

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
      'hprose-html5': 'hprose',
    }
  }],
  plugins: [
    rollupTypescript({
      typescript
    }),
    commonjs(),
  ],
  external: [
    'tslib'
  ]
}, {
  input: 'index.ts',
  output: [{
    file: 'lib/l-api.browser.min.js',
    format: 'umd',
    name: 'QxzLApi',
    globals: {},
    sourceMap: true,
  }],
  plugins: [
    rollupTypescript({
      typescript
    }),
    resolve({browser: true}),
    commonjs(),
    uglifyES
  ]
}]
