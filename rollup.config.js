import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;
const extensions = [
	'.ts', '.tsx','.js','.jsx'
];

const name = 'MapboxReacted';

const config = {
	input: './ts-build/index.js',
	
	// Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
	// https://rollupjs.org/guide/en#external-e-external
	external: ['react', 'react-dom','mapboxGl','crypto'],
	
	plugins: [
		// Allows node_modules resolution
		resolve({
			extensions,
			preferBuiltins: true,
		}),
		
		// Allow bundling cjs modules. Rollup doesn't understand cjs
		commonjs({extensions}),
		
		babel({
			extensions,
			include: ['ts-build/**/*'],
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
			'crypto':'crypto',
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