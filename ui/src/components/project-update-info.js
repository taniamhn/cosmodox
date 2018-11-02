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
import { fileIcon } from './my-icons.js';

const fileElem = (file) => {
  return html`
    <li class="file">
      <a target="blank" rel="external" href="${file.url}">
        <div>${fileIcon}</div>
        <span>${file.shortName}</span>
      </a>
    </li>
  `;
};

class ProjectUpdateInfo extends LitElement {
  render() {
    const { projectUpdate } = this;
    const { files = [] } = projectUpdate;

    return html`
      <style>
        :host {
          display: block;
        }

        :host > div {
          border-radius: 10px;
          border: 1px solid;
          padding: 10px;
        }

        p {
          margin: 0;
        }

        li {
          list-style-type: none;
        }

        a {
          color: var(--material-primary-color);
          text-decoration: none;
        }

        .file a {
          display: flex;
        }
      </style>
      <div>
        <p>${projectUpdate.content}</p>
        <ul>
          ${files.map(f => fileElem(f.document))}
        </ul>
        <time>${projectUpdate.createdAt}</time>
        <span>${projectUpdate.createdBy.fullName}</span>
        <a @click="${(e) => { this.fireOpenComments(e); }}">Ver comentarios</a>
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

  fireOpenComments(e) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('open-comments', {
      detail: { projectUpdate: this.projectUpdate.id },
    }));
  }
}

window.customElements.define('project-update-info', ProjectUpdateInfo);
