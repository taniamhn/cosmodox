/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from '@polymer/lit-element';

export const SharedStyles = html`
<style>
  :host {
    display: block;
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
  }

  li {
    list-style-type: none;
  }

  section {
    padding: 24px;
    background: var(--app-section-odd-color);
  }

  section > * {
    max-width: 600px;
    margin-right: auto;
    margin-left: auto;
  }

  section:nth-of-type(even) {
    background: var(--app-section-even-color);
  }

  h2 {
    font-size: 24px;
    text-align: center;
    color: var(--app-dark-text-color);
  }

  iron-image {
    width: 150px;
    height: 150px;
  }

  .basic-info {
    display: grid;
  }

  .basic-info iron-image {
    width: 100%;
  }

  .basic-info h3 {
    margin: 0;
  }

  @media (min-width: 460px) {
    h2 {
      font-size: 36px;
    }

    .basic-info {
      grid-template-columns: 1fr 3fr;
      grid-gap: 10px;
      grid-template-areas:
        "image basic"
        "extra extra";
    }

    .basic-info iron-image {
      grid-area: image;
    }

    .basic-info .basic {
      grid-area: basic;
    }

    .basic-info .extra {
      grid-area: extra;
    }
  }

  .circle {
    display: block;
    width: 64px;
    height: 64px;
    margin: 0 auto;
    text-align: center;
    border-radius: 50%;
    background: var(--app-primary-color);
    color: var(--app-light-text-color);
    font-size: 30px;
    line-height: 64px;
  }
</style>
`;
