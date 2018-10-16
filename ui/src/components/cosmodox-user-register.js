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
import '@vaadin/vaadin-combo-box/theme/material/vaadin-combo-box.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-password-field.js';
import 'concrete-elements/src/elements/ConcreteLoadingIcon.js';

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
    const { nivelesEducativos, areas, loading } = this;
    return html`
      <style>
        form {
          display: grid;
        }
      </style>
      <iron-form>
        <form>
          <vaadin-text-field name="firstName" label="Nombres" required></vaadin-text-field> <br>
          <vaadin-text-field name="lastName" label="Apellidos" required></vaadin-text-field> <br>
          <vaadin-text-field name="email" label="Email" type="email" required></vaadin-text-field> <br>
          <vaadin-combo-box name="educationLevel" label="Nivel de educación alcanzado" .items=${nivelesEducativos}></vaadin-combo-box> <br>
          <label>Áreas de interés</label> <br>
          ${areas.map(area => html`<vaadin-checkbox value="${area.id}">${area.nombre}</vaadin-checkbox>`)} <br>
          <vaadin-text-field name="password1" label="Contraseña" type="password" required></vaadin-text-field> <br>
          <vaadin-text-field name="password2" label="Confirmar contraseña" type="password" required></vaadin-text-field> <br>
          <vaadin-button @click="${() => this.createAccount()}">${createButtonText(loading)}</vaadin-button>
        </form>
      </iron-form>
    `;
  }

  static get properties() {
    return {
      areas: { type: Array },
      nivelesEducativos: { type: Array },
    };
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

    this.nivelesEducativos = ['Estudiante', 'Bachiller', 'Universitario', 'Posgrado', 'Otro'];
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
