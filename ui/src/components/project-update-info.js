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

class ProjectUpdateInfo extends LitElement {
  render() {
    const { projectUpdate } = this;

    return html`
      <style>
      </style>
      <div>
        <p>${projectUpdate.content}</p>
        <time>${projectUpdate.createdAt}</time>
        <span>${projectUpdate.createdBy.fullName}</span>
      </div>
    `;
  }

  static get properties() {
    return {
      projectUpdate: { type: Object },
    };
  }

  constructor() {
    super();
    this.projectUpdate = {};
  }
}

window.customElements.define('project-update-info', ProjectUpdateInfo);
