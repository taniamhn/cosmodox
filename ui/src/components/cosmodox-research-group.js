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
import '@vaadin/vaadin-checkbox/theme/material/vaadin-checkbox.js';
import '@vaadin/vaadin-combo-box/theme/material/vaadin-combo-box.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field.js';
import './project-info.js';
import './new-project.js';
import './user-info.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class CosmodoxResearchGroup extends PageViewElement {
  render() {
    const { areas, researchGroup, editing } = this;

    return html`
      ${SharedStyles}
      <style>
        iron-image {
          width: 150px;
          height: 150px;
        }
      </style>
      <section>
        <h2>Grupo de investigación</h2>
        ${editing 
          ? html`
            <iron-form>
              <form>
                <vaadin-text-field label="Nombre" required value="${researchGroup.nombre}"></vaadin-text-field>
                <vaadin-text-field label="Email" type="email" required value="${researchGroup.email}"></vaadin-text-field>
                <vaadin-combo-box label="Institucion" value="${researchGroup.institucion}"></vaadin-combo-box> <br>
                <label>Áreas de enfoque *</label> <br>
                ${areas.map((area) => html`<vaadin-checkbox ?checked="${this._groupInterestInArea(area, researchGroup.areas)}" value="${area.id}">${area.nombre}</vaadin-checkbox>`)}
              </form>
            </iron-form>
            
            <paper-button @click="${() => this.editProfile()}">editar</paper-button>
            <paper-button @click="${() => this.editing = false}">cancelar</paper-button>
          `
          :
          html`
            <paper-button @click="${() => this.editing = true}">${editIcon}</paper-button> <br>
            <iron-image src="${researchGroup.image}" placeholder="../images/profile-none.png" sizing="cover" preload fade></iron-image>
            <p>
              ${researchGroup.nombre} <br>
              ${researchGroup.email} <br>
              ${researchGroup.institucion} <br>
            </p>
            <h3>Áreas de enfoque</h3>
            <ul>${researchGroup.areas.map((area) => html`<li>${area.nombre}</li>`)}</ul>
          `
        }
      </section>
      <section>
        <h3>Integrantes</h3>
        <ul>${researchGroup.integrantes.map((integrante) => html`<user-info .user=${integrante}></user-info>`)}</ul>
      </section>
      <section>
        <h3>Proyectos</h3>
        <paper-button @click="${() => this.shadowRoot.querySelector('new-project').opened = true}">${addIcon} nuevo</paper-button>
        <ul>${researchGroup.projects.map((project) => html`<li><project-info .project=${project}></project-info></li>`)}</ul>
        <new-project></new-project>
      </section>
    `
  }

  static get properties() {
    return {
      areas: { type: Array },
      researchGroup: { type: Object },
      editing: { type: Boolean },
    }
  }

  constructor() {
    super();
    this.areas = [
      { id: 1, nombre: 'Artes' },
      { id: 2, nombre: 'Ciencias Exactas' },
      { id: 3, nombre: 'Emprendimiento' },
      { id: 4, nombre: 'Lenguas y cultura' },
      { id: 5, nombre: 'Pensamiento global' },
      { id: 6, nombre: 'Tecnología' },
      { id: 7, nombre: 'Otros' },
    ];
    this.editing = false;
    this.researchGroup = {
      image: '/',
      nombre: 'Mariana',
      email: 'mariana@oquendo.com',
      institucion: 'La enseñanza',
      areas: [
        { id: 1, nombre: 'Tecnologia' },
      ],
      integrantes: [
        { nombreCompleto: 'Arly Mendoza' },
        { nombreCompleto: 'Maria Gallego' },
      ],
      projects: [
        { image: '/', name: 'cosmodox', theme: 'projects' },
        { image: '/', name: 'project 2', theme: 'theme' },
        { image: '/', name: 'project 3', theme: 'theme' },
      ]
    };
  }

  _groupInterestInArea(area, groupAreas) {
    return !!groupAreas.find((elem) => elem.id === area.id);
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

window.customElements.define('cosmodox-research-group', CosmodoxResearchGroup);
