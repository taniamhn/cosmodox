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
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-password-field.js';
import 'concrete-elements/src/elements/ConcreteLoadingIcon.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

const createInstitutionMutation = Apollo.gql`
  mutation createInstitution($input: InstitutionCreateGenericType!) {
    createInstitution(input: $input) {
      ok
      errors { field, messages }
      institution { id, detailUrl }
    }
  }
`;

const createButtonText = loading => html`${loading ? html`<concrete-loading-icon></concrete-loading-icon>` : html`Crear cuenta`}`;

class InstitutionRegisterForm extends ApolloMutation {
  render() {
    const { loading } = this;
    return html`
      <style>
        form {
          display: grid;
        }
      </style>
      <iron-form>
          <form>
            <vaadin-text-field name="name" label="Nombre" required></vaadin-text-field>
            <vaadin-text-field name="email" label="Email" type="email" required></vaadin-text-field>
            <vaadin-text-field name="firstName" label="Nombres del responsable" required></vaadin-text-field>
            <vaadin-text-field name="lastName" label="Apellidos del responsable" required></vaadin-text-field>
            <vaadin-password-field name="password1" label="Contraseña" required></vaadin-password-field>
            <vaadin-password-field name="password2" label="Confirmar contraseña" required></vaadin-password-field>
            <vaadin-button @click="${() => this.createAccount()}">${createButtonText(loading)}</vaadin-button>
          </form>
        </iron-form>
    `;
  }

  constructor() {
    super();
    console.log('constructor');
    this.client = Apollo.client;
    this.mutation = createInstitutionMutation;
    this.onCompleted = (data) => {
      console.log(data.createInstitution);
      const { ok, institution } = data.createInstitution;
      if (ok) {
        login(this);
        window.location = institution.detailUrl;
      }
    };
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
      this.mutate();
    }
  }
}

window.customElements.define('institution-register-form', InstitutionRegisterForm);

class CosmodoxInstitutionRegister extends PageViewElement {
  render() {
    return html`
      ${SharedStyles}
      <section>
        <h2>Nueva institución</h2>
        <institution-register-form></institution-register-form>
      </section>
    `;
  }
}

window.customElements.define('cosmodox-institution-register', CosmodoxInstitutionRegister);
