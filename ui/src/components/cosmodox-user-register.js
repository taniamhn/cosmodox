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
import '@vaadin/vaadin-checkbox/theme/material/vaadin-checkbox.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field';
import '@vaadin/vaadin-combo-box/theme/material/vaadin-combo-box.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-password-field.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class CosmodoxUserRegister extends PageViewElement {
  render() {
    const { nivelesEducativos, areas } = this;
    return html`
      ${SharedStyles}
      <style>
        form {
          display: grid;
        }
      </style>
      <section>
        <h2>Nuevo usuario</h2>
        <iron-form>
          <form>
            <vaadin-text-field label="Nombres" required></vaadin-text-field> <br>
            <vaadin-text-field label="Apellidos" required></vaadin-text-field> <br>
            <vaadin-text-field label="Email" type="email" required></vaadin-text-field> <br>
            <vaadin-combo-box label="Nivel de educación alcanzado" .items=${nivelesEducativos}></vaadin-combo-box> <br>
            <label>Áreas de interés</label> <br>
            ${areas.map((area) => html`<vaadin-checkbox value="${area.id}">${area.nombre}</vaadin-checkbox>`)} <br>
            <vaadin-text-field label="Contraseña" type="password" required></vaadin-text-field> <br>
            <vaadin-text-field label="Confirmar contraseña" type="password" required></vaadin-text-field> <br>
            <vaadin-button @click="${() => this.createAccount()}">Crear cuenta</vaadin-button>
          </form>
        </iron-form>
      </section>
    `
  }

  static get properties() {
    return {
      areas: { type: Array },
      nivelesEducativos: { type: Array },
    }
  }

  constructor() {
    super();
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

  createAccount() {
    const form = this.shadowRoot.querySelector('iron-form');
    if (form.validate()) {
      console.log('valid');
      window.location = '/profile';
      // Inscribe @to_do terminar

    }
  }
}

window.customElements.define('cosmodox-user-register', CosmodoxUserRegister);
