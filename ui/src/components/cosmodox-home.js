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
import '@polymer/paper-dialog/paper-dialog.js';
import '@vaadin/vaadin-button/theme/material/vaadin-button.js';
import 'concrete-elements/src/elements/ConcreteLoadingIcon.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-password-field.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

const loginMutation = Apollo.gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      user {
        id
        profile { id, detailUrl }
      }
    }
  }
`;

const loginButtonText = loading => html`${loading ? html`<concrete-loading-icon></concrete-loading-icon>` : 'Iniciar sesión'}`;

class LoginForm extends ApolloMutation {
  render() {
    const { loading, data } = this;
    const ok = data ? data.login.ok : true;

    return html`
      <style>
        form {
          display: grid;
        }

        .error {
          color: var(--error-color);
        }
      </style>
      <iron-form>
        <form>
          <p ?hidden="${ok}" class="error">El email y/o la contraseña son incorrectos</p>
          <vaadin-text-field name="email" label="Email" type="email" required></vaadin-text-field>
          <vaadin-password-field name="password" label="Contraseña" type="password" required></vaadin-password-field>
          <vaadin-button @click="${() => this.login()}">${loginButtonText(loading)}</vaadin-button>
        </form>
      </iron-form>
    `;
  }

  constructor() {
    super();
    this.client = Apollo.client;
    this.mutation = loginMutation;
    this.onCompleted = (data) => {
      const { ok, user } = data.login;
      if (ok) {
        login(this);
        window.location = user.profile.detailUrl;
      }
    };
  }

  _mutationData({ email, password } = {}) {
    return { email, password };
  }

  login() {
    const form = this.shadowRoot.querySelector('iron-form');
    if (form.validate()) {
      this.variables = this._mutationData(form.serializeForm());
      this.mutate();
    }
  }
}

window.customElements.define('login-form', LoginForm);

class CosmodoxHome extends PageViewElement {
  render() {
    return html`
      ${SharedStyles}
      <style>
        form {
          display: grid;
        }

        paper-dialog div {
          display: grid;
          grid-gap: 10px;
        }
      </style>
      <section>
        <h2>Algo no se sabe que es</h2>
        <p>The page you're looking for doesn't seem to exist. Head back
           <a href="/">home</a> and try again?
        </p>
      </section>
      <section>
        <div>
          <login-form></login-form>
          <p>¿No tienes cuenta? <a href="/#" @click="${() => this.shadowRoot.querySelector('paper-dialog').opened = true}">Registrate</a></p>
        </div>
      </section>
      <paper-dialog modal>
          <h3>Que tipo de cuenta vas a crear</h3>
          <div>
            <a href="/register/institution"><vaadin-button dialog-dismiss theme="outlined">Institución</vaadin-button></a>
            <a href="/register/group"><vaadin-button dialog-dismiss theme="outlined">Grupo de investigación</vaadin-button></a>
            <a href="/register/user"><vaadin-button dialog-dismiss theme="outlined">Personal</vaadin-button></a>
          </div>
      </paper-dialog>
    `
  }
}

window.customElements.define('cosmodox-home', CosmodoxHome);
