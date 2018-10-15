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
import { PageViewElement } from './page-view-element.js';
import '@polymer/iron-form/iron-form.js';
import '@vaadin/vaadin-button/theme/material/vaadin-button.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field';
import '@vaadin/vaadin-text-field/theme/material/vaadin-password-field.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class CosmodoxInstitutionRegister extends PageViewElement {
  render() {
    return html`
      ${SharedStyles}
      <style>
        form {
          display: grid;
        }
      </style>
      <section>
        <h2>Nueva institución</h2>
        <iron-form>
          <form>
            <vaadin-text-field label="Nombre" required></vaadin-text-field>
            <vaadin-text-field label="Email" type="email" required></vaadin-text-field>
            <vaadin-text-field label="Nombre del responsable" required></vaadin-text-field>
            <vaadin-text-field label="Contraseña" type="password" required></vaadin-text-field>
            <vaadin-text-field label="Confirmar contraseña" type="password" required></vaadin-text-field>
            <vaadin-button @click="${() => this.createAccount()}">Crear cuenta</vaadin-button>
          </form>
        </iron-form>
      </section>
    `
  }

  createAccount() {
    const form = this.shadowRoot.querySelector('iron-form');
    if (form.validate()) {
      console.log('valid');
      window.location = '/profile';
      // Inscribe @to_do terminar
    }
  }
}

window.customElements.define('cosmodox-institution-register', CosmodoxInstitutionRegister);
