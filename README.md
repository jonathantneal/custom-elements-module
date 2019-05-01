# custom-elements-module [<img src="https://jonneal.dev/js-logo.svg" alt="" width="90" height="90" align="right">][custom-elements-module]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[custom-elements-module] is a polyfill for HTML Custom Elements recompiled from
[@webcomponents/custom-elements].

This recompiled version is functionally identical, except that it does not
assume browser globals and it provides control over which `window` object is
polyfilled, allowing usage in and out of browser environments.

```html
<script src="https://unpkg.com/custom-elements-module"></script>
<script>
polyfillCustomElements(window)

customElements.define(
  'x-h',
  class CustomH extends HTMLElement {
    constructor () {
      super()

      this.attachShadow({ mode: 'open' }).appendChild(
        document.createElement('slot')
      )
    }
  }
)
</script>
```

```js
import polyfillCustomElements from 'custom-elements-module'
import jsdom from 'jsdom'

const { window } = new jsdom.JSDOM(`<x-h>Custom H</x-h>`, {
  beforeParse (window) {
    polyfillCustomElements(window)
  }
})

const { customElements, document, HTMLElement } = window

customElements.define(
  'x-h',
  class CustomH extends HTMLElement {
    constructor () {
      super()

      this.attachShadow({ mode: 'open' }).appendChild(
        document.createElement('slot')
      )
    }
  }
)
```

There are no other differences between this polyfill and
[@webcomponents/custom-elements]. Although, due to gzipping representation,
this version ends up being 357 bytes smaller.

[cli-img]: https://img.shields.io/travis/jonathantneal/custom-elements-module.svg
[cli-url]: https://travis-ci.org/jonathantneal/custom-elements-module
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/custom-elements-module.svg
[npm-url]: https://www.npmjs.com/package/custom-elements-module

[@webcomponents/custom-elements]: https://github.com/webcomponents/custom-elements
[Babel]: https://babeljs.io/
[custom-elements-module]: https://github.com/jonathantneal/custom-elements-module
