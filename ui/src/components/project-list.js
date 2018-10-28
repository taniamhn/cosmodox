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
import './project-info.js';

class ProjectList extends LitElement {
  render() {
    const { projects } = this;

    return html`
      <style>
        :host {
          display: block;
        }

        ul {
          display: grid;
          grid-gap: 10px;
          padding-inline-start: 5px;
          grid-template-columns: repeat(auto-fill, minmax(10em, 1fr));
        }

        li {
          list-style-type: none;
        }
      </style>
      <ul>
        ${projects.map(project => html`<li><project-info .project="${project}"></project-info></li>`)}
      </ul>
    `;
  }

  static get properties() {
    return {
      projects: { type: Array },
    };
  }

  constructor() {
    super();
    this.projects = [];
  }
}

window.customElements.define('project-list', ProjectList);
