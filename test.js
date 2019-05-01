/* eslint-disable no-console */

const polyfillCustomElements = require('.');
const jsdom = require('jsdom');

const { window } = new jsdom.JSDOM(`<x-h>Custom H</x-h>`, {
	beforeParse (window) {
		polyfillCustomElements(window);
	}
});

const { customElements, document, HTMLElement } = window;

let __didConstructorFire = 0, __didConnectedCallbackFire = 0, __didAttributeChangedCallbackFire = 0;

const assert = require('assert');

console.log('custom-elements-ponyfill: testing is ready');
assert.strictEqual(__didConstructorFire, 0);
assert.strictEqual(__didConnectedCallbackFire, 0);
assert.strictEqual(__didAttributeChangedCallbackFire, 0);
console.log('  PASS');

customElements.define(
	'x-h',
	class CustomH extends HTMLElement {
		constructor () {
			super();

			++__didConstructorFire;

			this.attachShadow({ mode: 'open' }).appendChild(
				document.createElement('slot')
			);
		}

		connectedCallback () {
			++__didConnectedCallbackFire;
		}

		attributeChangedCallback () {
			++__didAttributeChangedCallbackFire;
		}

		static get observedAttributes () {
			return ['level'];
		}
	}
);

try {
	console.log('custom-elements-ponyfill: custom element constructor correctly fires');
	assert.strictEqual(__didConstructorFire, 1);
	const __xh = document.createElement('x-h');
	assert.strictEqual(__didConstructorFire, 2);
	console.log('  PASS');

	console.log('custom-elements-ponyfill: custom element connectedCallback correctly fires');
	assert.strictEqual(__didConnectedCallbackFire, 1);
	document.body.appendChild(__xh);
	assert.strictEqual(__didConnectedCallbackFire, 2);
	console.log('  PASS');

	console.log('custom-elements-ponyfill: custom element attributeChangedCallback correctly fires');
	assert.strictEqual(__didAttributeChangedCallbackFire, 0);
	__xh.setAttribute('ignore', '');
	assert.strictEqual(__didAttributeChangedCallbackFire, 0);
	__xh.setAttribute('level', 1);
	assert.strictEqual(__didAttributeChangedCallbackFire, 1);
	console.log('  PASS');

	process.exit(0);
} catch (error) {
	console.log('FAIL');
	console.log(error.message);

	process.exit(1);
}
