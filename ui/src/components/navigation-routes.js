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

const notAuthenticatedRoutes = (page) => {
  return html`
    <a ?selected="${page === 'profile'}" href="/profile">Perfil</a>
    <a ?selected="${page === 'research-group'}" href="/research-group">Grupo de investigación</a>
    <a ?selected="${page === 'institution'}" href="/institution">Institución</a>
    <a ?selected="${page === 'project'}" href="/project">Proyecto</a>
  `;
}

class NavigationRoutes extends LitElement {
  render() {
    const { page, isAuthenticated } = this;
    return html`${isAuthenticated ? notAuthenticatedRoutes(page) : html`<a ?selected="${page === 'home'}" href="/home">Home</a>`}`;
  }

  static get properties() {
    return {
      page: { type: String },
      isAuthenticated: { type: Boolean },
    }
  }

  constructor() {
    super();
    this.isAuthenticated = false;
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('navigation-routes', NavigationRoutes);
