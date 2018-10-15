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
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea';
import '@polymer/paper-dialog/paper-dialog.js';
import '@vaadin/vaadin-button/theme/material/vaadin-button.js';
import '@vaadin/vaadin-combo-box/theme/material/vaadin-combo-box.js';

class NewProject extends LitElement {
  render() {
    const { areas, opened } = this;

    return html`
      <style>
      </style>
      <paper-dialog ?opened=${opened} modal>
        <h2>Nuevo proyecto</h2>
        <iron-form>
          <form>
            <paper-input label="Nombre *" required></paper-input>
            <paper-input label="Tema *" required></paper-input>
            <vaadin-combo-box label="Área de enfoque" required .items="${areas}"></vaadin-combo-box>
            <paper-input label="Instituciones vinculadas"></paper-input>
            <paper-textarea label="Descripción"></paper-textarea>
          </form>
        </iron-form>
        <div class="buttons">
          <vaadin-button @click="${() => this.opened = false}">Cancelar</vaadin-button>
          <vaadin-button @click="${() => this.createProject()}">Crear</vaadin-button>
        </div>
      </paper-dialog>
    `;
  }

  static get properties() {
    return {
      areas: { type: Array },
      opened: { type: Boolean },
    }
  }
  
  constructor() {
    super();
    this.opened = false;
    this.areas = [
      { id: 1, nombre: 'Tecnologia' },
      { id: 2, nombre: 'Ciencias Exactas' },
    ];
  }

  createProject() {
    const form = this.shadowRoot.querySelector('iron-form');
    if (form.validate()) {
      console.log('valid');
      this.opened = false;
    }
  }
}

window.customElements.define('new-project', NewProject);
