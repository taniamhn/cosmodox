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
import '@polymer/paper-dialog/paper-dialog.js';
import '@vaadin/vaadin-button/theme/material/vaadin-button.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-password-field.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

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
          <iron-form>
            <form>
              <vaadin-text-field label="Email" type="email" required></vaadin-text-field>
              <vaadin-password-field label="Contraseña" type="password" required></vaadin-password-field>
              <vaadin-button>Iniciar sesión</vaadin-button>
            </form>
          </iron-form>
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
