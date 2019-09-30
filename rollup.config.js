import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import typescript from 'rollup-plugin-typescript2';

const env = process.env.NODE_ENV;
const extensions = [
	'.ts', '.tsx','.js','.jsx'
];

const name = 'MapboxReacted';

const config = {
	input: './src/index.ts',
	external: ['react', 'react-dom','mapbox-gl','uuid'],
	plugins: [
		typescript(),
		resolve({
			extensions,
			preferBuiltins: true,
		}),
		// Allow bundling cjs modules. Rollup doesn't understand cjs
		commonjs(),
		babel({
			extensions,
			include: ['src/**/*'],
			exclude: '**/node_modules/**',
			runtimeHelpers:true
		}),
	],
	
	output: {
		name,
		exports:'named',
		file:
			env === 'production'
				? 'dist/mapbox-reacted.min.js'
				: 'dist/mapbox-reacted.js',
		format: 'umd',
		globals: {
			'uuid':'uuid',
			'mapbox-gl':'MapboxGl',
			react: 'React',
			'react-dom': 'ReactDOM',
		},
	},
};
if (env === 'production') {
	config.plugins.push(
		uglify({
			compress: {
				dead_code: true,
			},
		})
	)
}
export default config;
