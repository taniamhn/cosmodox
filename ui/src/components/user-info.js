/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from '@polymer/lit-element';
import '@polymer/iron-image/iron-image.js';

class UserInfo extends LitElement {
  render() {
    const { user } = this;

    return html`
      <style>
        iron-image {
          width: 100px;
          height: 100px;
        }
      </style>
      <iron-image src="${user.image}" placeholder="../images/profile-none.png" sizing="cover" preload fade></iron-image>
      <div class="name">${user.nombreCompleto}</div>
    `;
  }

  static get properties() {
    return {
      user: { type: Object },
    }
  }
  
  constructor() {
    super();
    this.user = {};
  }
}

window.customElements.define('user-info', UserInfo);
