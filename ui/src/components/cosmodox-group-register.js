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
import { ApolloMutation } from 'lit-apollo/apollo-mutation';
import { PageViewElement } from './page-view-element.js';
import { login } from '../auth.js';
import '@polymer/iron-form/iron-form.js';
import '@vaadin/vaadin-button/theme/material/vaadin-button.js';
import '@vaadin/vaadin-checkbox/theme/material/vaadin-checkbox.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field';
import '@vaadin/vaadin-text-field/theme/material/vaadin-password-field.js';
import 'concrete-elements/src/elements/ConcreteLoadingIcon.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

const createMutation = Apollo.gql`
  mutation createResearchGroup($input: ResearchGroupCreateGenericType!) {
    createResearchGroup(input: $input) {
      ok
      errors { field, messages }
      researchGroup { id, detailUrl }
    }
  }
`;

const createButtonText = loading => html`${loading ? html`<concrete-loading-icon></concrete-loading-icon>` : html`Crear cuenta`}`;

class ResearchGroupRegisterForm extends ApolloMutation {
  render() {
    const { loading, areas } = this;

    return html`
      <style>
        form {
          display: grid;
        }
      </style>
      <iron-form>
        <form>
          <vaadin-text-field name="name" label="Nombre del grupo" required></vaadin-text-field>
          <vaadin-text-field name="email" label="Email" type="email" required></vaadin-text-field>
          <vaadin-text-field name="firstName" label="Nombre del lider" required></vaadin-text-field>
          <vaadin-text-field name="lastName" label="Apellido del lider" required></vaadin-text-field>
          <vaadin-text-field name="institution" label="Institución educativa "></vaadin-text-field><br>
          <label>Áreas de enfoque</label> <br>
          ${areas.map(area => html`<vaadin-checkbox value="${area.id}">${area.nombre}</vaadin-checkbox>`)} <br>
          <vaadin-text-field name="password1" label="Contraseña" type="password" required></vaadin-text-field>
          <vaadin-text-field name="password2" label="Confirmar contraseña" type="password" required></vaadin-text-field>
          <vaadin-button @click="${() => this.createAccount()}">${createButtonText(loading)}</vaadin-button>
        </form>
      </iron-form>  
    `;
  }

  static get properties() {
    return {
      areas: { type: Array },
    };
  }

  constructor() {
    super();
    this.client = Apollo.client;
    this.mutation = createMutation;
    this.onCompleted = (data) => {
      const { ok, researchGroup } = data.createResearchGroup;
      if (ok) {
        login(this);
        window.location = researchGroup.detailUrl;
      }
    };

    this.areas = [
      { id: 1, nombre: 'Artes' },
      { id: 2, nombre: 'Ciencias Exactas' },
      { id: 3, nombre: 'Emprendimiento' },
      { id: 4, nombre: 'Lenguas y cultura' },
      { id: 5, nombre: 'Pensamiento global' },
      { id: 6, nombre: 'Tecnología' },
      { id: 7, nombre: 'Otros' },
    ];
  }

  _mutationData({ name, email, firstName, lastName, password1, password2 } = {}) {
    return {
      name,
      owner: { email, lastName, firstName, password1, password2 },
    };
  }

  createAccount() {
    const form = this.shadowRoot.querySelector('iron-form');
    if (form.validate()) {
      this.variables = { input: this._mutationData(form.serializeForm()) };
      console.log(this.variables);
      // this.mutate();
    }
  }
}

window.customElements.define('research-group-register-form', ResearchGroupRegisterForm);

class CosmodoxGroupRegister extends PageViewElement {
  render() {
    return html`
      ${SharedStyles}
      <section>
        <h2>Nuevo grupo</h2>
        <research-group-register-form></research-group-register-form>
      </section>
    `;
  }
}

window.customElements.define('cosmodox-group-register', CosmodoxGroupRegister);
