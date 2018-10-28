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

class ProjectInfo extends LitElement {
  render() {
    const { project } = this;
    const image = project.image || {};

    return html`
      <style>
        :host {
          display: block;
        }

        a {
          text-decoration: none;
          color: var(--primary-text-color);
        }

        iron-image {
          width: 100px;
          height: 100px;
        }

        .main {
          display: flex;
          align-items: center;
          flex-direction: column;
        }
      </style>

      <a href="${project.detailUrl}">
        <div class="main">
          <iron-image src="${image.url}" placeholder="/static/images/project-none.png" sizing="cover" preload fade></iron-image>
          <div class="name">${project.name}</div>
          <span class="theme">${project.theme}</span>
        </div>
      </a>
    `;
  }

  static get properties() {
    return {
      project: { type: Object },
    };
  }

  constructor() {
    super();
    this.project = {};
  }
}

window.customElements.define('project-info', ProjectInfo);
