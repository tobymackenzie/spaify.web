import {nodeResolve} from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

export default {
	input: '_scripts.js',
	output: {
		file: '_scripts.min.js',
		format: 'iife',
	},
	plugins: [
		nodeResolve(),
		terser(),
	],
}
