/* eslint-disable no-console */

console.log('Loading custom-elements...');

const fs = require('fs');

const customElementsPolyfillPath = require.resolve('@webcomponents/custom-elements');
const customElementsPolyfillCode = fs.readFileSync(customElementsPolyfillPath, 'utf8');

console.log('Transforming custom-elements...');

const babelMapOptions = {
	filename: customElementsPolyfillPath,
	inputSourceMap: true,
	sourceMaps: true
};

const babelPluginTransformGlobals = require('babel-plugin-transform-globals');
const babelPluginFuncWrap = require('babel-plugin-func-wrap');

const babelOptionsESM = {
	...babelMapOptions,
	plugins: [
		[babelPluginTransformGlobals, { replace: 'browser' }],
		[babelPluginFuncWrap, { format: 'esm', args: ['window'] }]
	],
	comments: false
};

const babelOptionsCJS = {
	...babelMapOptions,
	plugins: [
		[babelPluginTransformGlobals, { replace: 'browser' }],
		[babelPluginFuncWrap, { format: 'cjs', args: ['window'] }]
	]
};

const babelOptionsBJS = {
	...babelMapOptions,
	plugins: [
		[babelPluginTransformGlobals, { replace: 'browser' }],
		[babelPluginFuncWrap, { format: 'global', name: 'polyfillCustomElements', args: ['window'] }]
	]
};

const babel = require('@babel/core');

const resultCJS = babel.transformSync(customElementsPolyfillCode, babelOptionsCJS);
const resultESM = babel.transformSync(customElementsPolyfillCode, babelOptionsESM);
const resultBJS = babel.transformSync(customElementsPolyfillCode, babelOptionsBJS);

console.log('Compressing custom-elements...');

const basename = 'index';
const bjsname = 'custom-elements';
const terser = require('terser');

const resultTerseCJS = terser.minify(resultCJS.code, {
	sourceMap: {
		content: resultCJS.map,
		filename: `${basename}.js`,
		url: `${basename}.js.map`
	}
});

const resultTerseESM = terser.minify(resultESM.code, {
	sourceMap: {
		content: resultESM.map,
		filename: `${basename}.mjs`,
		url: `${basename}.mjs.map`
	}
});

const resultTerseBJS = terser.minify(resultBJS.code, {
	sourceMap: {
		content: resultBJS.map,
		filename: `${bjsname}.js`,
		url: `${bjsname}.js.map`
	}
});

console.log('Writing custom-elements...');

fs.writeFileSync(`${basename}.js`, resultTerseCJS.code);
fs.writeFileSync(`${basename}.js.map`, resultTerseCJS.map);

fs.writeFileSync(`${basename}.mjs`, resultTerseESM.code);
fs.writeFileSync(`${basename}.mjs.map`, resultTerseESM.map);

fs.writeFileSync(`${bjsname}.js`, resultTerseBJS.code);
fs.writeFileSync(`${bjsname}.js.map`, resultTerseBJS.map);

console.log('Finished!');
