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
import { addIcon, editIcon } from './my-icons.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@vaadin/vaadin-checkbox/theme/material/vaadin-checkbox.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field.js';
import '@vaadin/vaadin-combo-box/theme/material/vaadin-combo-box.js';
import './new-project.js';
import './project-info.js';
import './join-research-group.js'

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class CosmodoxInstitution extends PageViewElement {
  render() {
    const { areas, institution, editing, nivelesEducativos } = this;

    return html`
      ${SharedStyles}
      <style>
        iron-image {
          width: 150px;
          height: 150px;
        }
      </style>
      <section>
        <h2>Institución</h2>
        ${editing 
          ? html`
            <iron-form>
              <form>
                <vaadin-text-field label="Nombre" required value="${institution.name}"></vaadin-text-field>
                <vaadin-text-field label="Email" type="email" required value="${institution.email}"></vaadin-text-field>
                <vaadin-text-field label="Nombre del responsable" required value="${institution.responsable}"></vaadin-text-field> <br>
              </form>
            </iron-form>
            
            <paper-button @click="${() => this.editInstitution()}">editar</paper-button>
            <paper-button @click="${() => this.editing = false}">cancelar</paper-button>
          `
          :
          html`
            <paper-button @click="${() => this.editing = true}">${editIcon}</paper-button> <br>
            <iron-image src="${institution.image}" placeholder="../images/profile-none.png" sizing="cover" preload fade></iron-image>
            <p>
              ${institution.name} <br>
              ${institution.email} <br>
              ${institution.responsable}
            </p>
          `
        }
      </section>
      <section>
        <h3>Grupos de investigación</h3>
        <ul>${institution.researchGroups.map((group) => html`<li>${group}</li>`)}</ul>
        <join-research-group></join-research-group>
      </section>
    `
  }

  static get properties() {
    return {
      institution: { type: Object },
      editing: { type: Boolean },
    }
  }

  constructor() {
    super();
    this.editing = false;
    this.institution = {
      image: '/',
      name: 'Mariana Oquendo',
      email: 'mariana@oquendo.com',
      responsable: 'Gustavo',
      researchGroups: ['GAIA', 'grupo 2'],
    };
  }

  _userInterestInArea(area, userAreas) {
    return !!userAreas.find((elem) => elem.id === area.id);
  }

  editProfile() {
    const form = this.shadowRoot.querySelector('iron-form');
    if (form.validate()) {
      console.log('valid');
      // TODO actual editing
      this.editing = false;
    }
  }
}

window.customElements.define('cosmodox-institution', CosmodoxInstitution);