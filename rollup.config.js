import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
// import babel from 'rollup-plugin-babel';

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/bundle.js',
        format: 'es',
        name: 'devtool',
    },
    plugins: [
        typescript({
            tsconfig: 'tsconfig.json',
        }),
        resolve(),
    ],
};
