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

class CosmodoxProfile extends PageViewElement {
  render() {
    const { areas, user, editing, nivelesEducativos } = this;

    return html`
      ${SharedStyles}
      <style>
        iron-image {
          width: 150px;
          height: 150px;
        }
      </style>
      <section>
        <h2>Perfil</h2>
        ${editing 
          ? html`
            <iron-form>
              <form>
                <vaadin-text-field label="Nombres" required value="${user.name}"></vaadin-text-field>
                <vaadin-text-field label="Apellidos" required value="${user.lastName}"></vaadin-text-field>
                <vaadin-text-field label="Email" type="email" required value="${user.email}"></vaadin-text-field>
                <vaadin-combo-box label="Nivel de educación alcanzado" .items=${nivelesEducativos}></vaadin-combo-box> <br>
                <vaadin-text-field label="Institucion" value="${user.school}"></vaadin-text-field> <br>
                <label>Áreas de interés *</label> <br>
                ${areas.map((area) => html`<vaadin-checkbox ?checked="${this._userInterestInArea(area, user.areas)}" value="${area.id}">${area.nombre}</vaadin-checkbox>`)}
              </form>
            </iron-form>
            
            <paper-button @click="${() => this.editProfile()}">editar</paper-button>
            <paper-button @click="${() => this.editing = false}">cancelar</paper-button>
          `
          :
          html`
            <paper-button @click="${() => this.editing = true}">${editIcon}</paper-button> <br>
            <iron-image src="${user.image}" placeholder="../images/profile-none.png" sizing="cover" preload fade></iron-image>
            <p>
              ${user.fullName} <br>
              ${user.email} <br>
              ${user.education} <br>
              ${user.school}
            </p>
            <h3>Áreas de interés</h3>
            <ul>${user.areas.map((area) => html`<li>${area.nombre}</li>`)}</ul>
          `
        }
      </section>
      <section>
        <h3>Grupos de investigación</h3>
        <paper-button @click="${() => this.shadowRoot.querySelector('join-research-group').opened = true}">unirse</paper-button>
        <ul>${user.researchGroups.map((group) => html`<li>${group}</li>`)}</ul>
        <join-research-group></join-research-group>
      </section>
      <section>
        <h3>Proyectos</h3>
        <paper-button @click="${() => this.shadowRoot.querySelector('new-project').opened = true}">${addIcon} nuevo</paper-button>
        <ul>${user.projects.map((project) => html`<li><project-info .project=${project}></project-info></li>`)}</ul>
        <new-project></new-project>
      </section>
    `
  }

  static get properties() {
    return {
      areas: { type: Array },
      nivelesEducativos: { type: Array },
      user: { type: Object },
      editing: { type: Boolean },
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
    this.editing = false;
    this.user = {
      image: '/',
      name: 'Mariana',
      lastName: 'Oquendo',
      fullName: 'Mariana Oquendo',
      email: 'mariana@oquendo.com',
      education:  'Bachillerato',
      school: 'La enseñanza',
      areas: [
        { id: 1, nombre: 'Tecnologia' },
      ],
      researchGroups: ['GAIA', 'grupo 2'],
      projects: [
        { image: '/', name: 'cosmodox', theme: 'projects' },
        { image: '/', name: 'project 2', theme: 'theme' },
        { image: '/', name: 'project 3', theme: 'theme' },
      ]
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

window.customElements.define('cosmodox-profile', CosmodoxProfile);
