import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

const BUILD_TYPE = process.env.BUILD

const base = {
  input: 'src/index.ts', // 打包入口
  plugins: [typescript(), terser()],
}

const config = {
  cjs: {
    ...base,
    output: { exports: 'auto', file: 'dist/index.cjs.js', format: 'cjs' },
  },
  esm: {
    ...base,
    output: { exports: 'auto', file: 'dist/index.esm.js', format: 'esm' },
  },
}

export default config[BUILD_TYPE]