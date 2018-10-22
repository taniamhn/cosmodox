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
import { ApolloQuery } from 'lit-apollo/apollo-query.js';

const profileRouteQuery = Apollo.gql`
  query currentUser {
    currentUser {
      id
      profile { id, detailUrl }
    }
  }
`;

class ProfileRoute extends ApolloQuery {
  render() {
    const { data, selected } = this;
    const currentUser = data && data.currentUser ? data.currentUser : { profile: {} };
    const { profile = {} } = currentUser;

    return html`
      <style>
        a {
        display: inline-block;
        color: var(--app-header-text-color);
        text-decoration: none;
      }

      a[selected] {
        color: var(--app-header-selected-color);
      }
      </style>
      <a ?selected="${selected}" href="${profile.detailUrl}">Perfil</a>
    `;
  }

  static get properties() {
    return {
      selected: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.selected = false;
    this.client = Apollo.client;
    this.query = profileRouteQuery;
  }

  shouldUpdate(changedProperties) {
    return super.shouldUpdate(changedProperties) || (changedProperties.has('selected') && !!this.data);
  }
}

window.customElements.define('profile-route', ProfileRoute);

const authenticatedRoutes = (page) => {
  return html`
    <profile-route ?selected="${['profile', 'research-group', 'institution'].includes(page)}"></profile-route>
    <a ?selected="${page === 'project'}" href="/project">Proyecto</a>
  `;
};

class NavigationRoutes extends LitElement {
  render() {
    const { page, isAuthenticated } = this;
    return html`${isAuthenticated ? authenticatedRoutes(page) : html`<a ?selected="${page === 'home'}" href="/home">Home</a>`}`;
  }

  static get properties() {
    return {
      page: { type: String },
      isAuthenticated: { type: Boolean },
    };
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
