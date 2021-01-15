import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';

import packageJson from './package.json';

// const isProd = process.env.NODE_ENV === 'production';
const IS_DEV = process.env.NODE_ENV === 'development';

export default {
  input: 'src/index.ts',
  output: [
    { file: packageJson.main, format: 'cjs', sourcemap: IS_DEV },
    { file: packageJson.module, format: 'esm', sourcemap: IS_DEV }
  ],
  // external: Object.keys(packageJson.peerDependencies || {}),
  external: ['react', 'react-dom', 'rxjs'],
  plugins: [
    postcss({
      // Minimize CSS, boolean or options for cssnano.
      minimize: true,
      // Extract CSS to the same location where JS file is generated but with .css extension.
      extract: true,
      // modules: true,
      use: {
        sass: null,
        stylus: null,
        less: { javascriptEnabled: true },
      },
    }),
    typescript({ useTsconfigDeclarationDir: true }),
    // babel({
    //   exclude: 'node_modules/**', // 防止打包node_modules下的文件
    //   runtimeHelpers: true, // 使plugin-transform-runtime生效
    // }),
    commonjs({ extensions: ['.js', '.ts'] }),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/env', '@babel/preset-react'],
      runtimeHelpers: true, // 使plugin-transform-runtime生效
    }),
  ],
};
