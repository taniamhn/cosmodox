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
import 'concrete-elements/src/elements/ConcreteLoadingIcon.js';
import '@vaadin/vaadin-button/theme/material/vaadin-button.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field';
import '@vaadin/vaadin-text-field/theme/material/vaadin-password-field.js';
import './education-levels-combo.js';
import './areas-checkbox.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

const createMutation = Apollo.gql`
  mutation createPersonalAccount($input: PersonalCreateGenericType!) {
    createPersonalAccount(input: $input) {
      ok
      errors { field, messages }
      personal { id, detailUrl }
    }
  }
`;

const createButtonText = loading => html`${loading ? html`<concrete-loading-icon></concrete-loading-icon>` : html`Crear cuenta`}`;

class UserRegisterForm extends ApolloMutation {
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
          <vaadin-text-field name="firstName" label="Nombres" required></vaadin-text-field>
          <vaadin-text-field name="lastName" label="Apellidos" required></vaadin-text-field>
          <vaadin-text-field name="email" label="Email" type="email" required></vaadin-text-field>
          <education-levels-combo name="educationLevel" required></education-levels-combo>
          <areas-checkbox name="areas"></areas-checkbox>
          <vaadin-password-field name="password1" label="Contraseña" required></vaadin-password-field>
          <vaadin-password-field name="password2" label="Confirmar contraseña" required></vaadin-password-field>
          <vaadin-button @click="${() => this.createAccount()}">${createButtonText(loading)}</vaadin-button>
        </form>
      </iron-form>
    `;
  }

  constructor() {
    super();
    this.client = Apollo.client;
    this.mutation = createMutation;
    this.onCompleted = (data) => {
      const { ok, personal } = data.createPersonalAccount;
      if (ok) {
        login(this);
        window.location = personal.detailUrl;
      }
    };
  }

  _mutationData({ name, areas, educationLevel, email, firstName, lastName, password1, password2 } = {}) {
    return {
      name,
      areas,
      educationLevel,
      user: { email, lastName, firstName, password1, password2 },
    };
  }

  createAccount() {
    const form = this.shadowRoot.querySelector('iron-form');
    const areasCheckbox = form.querySelector('areas-checkbox');
    const educationLevelCombo = form.querySelector('education-levels-combo');
    if (form.validate()) {
      const input = this._mutationData({
        ...form.serializeForm(),
        areas: areasCheckbox.value,
        educationLevel: educationLevelCombo.value,
      });
      this.variables = { input };
      this.mutate();
    }
  }
}

window.customElements.define('user-register-form', UserRegisterForm);

class CosmodoxUserRegister extends PageViewElement {
  render() {
    return html`
      ${SharedStyles}
      <section>
        <h2>Nuevo usuario</h2>
        <user-register-form></user-register-form>
      </section>
    `;
  }
}

window.customElements.define('cosmodox-user-register', CosmodoxUserRegister);
