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
import { ApolloQuery } from 'lit-apollo/apollo-query.js';
import { ApolloMutation } from 'lit-apollo/apollo-mutation.js';
import { PageViewElement } from './page-view-element.js';
import { addIcon, editIcon } from './my-icons.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-button/paper-button.js';
import 'concrete-elements/src/elements/ConcreteLoadingIcon.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field.js';
import './institutions-combo.js';
import './areas-checkbox.js';
import './project-info.js';
import './new-project.js';
import './user-info.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

const editMutation = Apollo.gql`
  mutation updateResearchGroup($input: ResearchGroupUpdateGenericType!) {
    updateResearchGroup(input: $input) {
      ok
      errors { field, messages }
      researchGroup {
        id
        name
        areas { id, name }
        institution { id, name, detailUrl }
        owner { id, email, firstName, lastName, fullName }
      }
    }
  }
`;

const editButtonText = loading => html`${loading ? html`<concrete-loading-icon></concrete-loading-icon>` : html`Editar`}`;

class EditResearchGroupForm extends ApolloMutation {
  render() {
    const { loading, researchGroup } = this;
    const { owner, institution } = researchGroup;
    const areas = researchGroup.areas || [];

    return html`
      <style>
        form {
          display: grid;
        }
      </style>
      <iron-form>
        <form>
          <vaadin-text-field name="name" label="Nombre del grupo" required .value="${researchGroup.name}"></vaadin-text-field>
          <vaadin-text-field name="email" label="Email" type="email" required .value="${owner.email}"></vaadin-text-field>
          <vaadin-text-field name="firstName" label="Nombre del lider" required .value="${owner.firstName}"></vaadin-text-field>
          <vaadin-text-field name="lastName" label="Apellido del lider" required .value="${owner.lastName}"></vaadin-text-field>
          <institutions-combo name="institution" required .value="${institution.id}"></institutions-combo>
          <areas-checkbox name="areas" .value="${areas.map(a => a.id)}"></areas-checkbox>
          <div>
            <vaadin-button @click="${() => this._fireEndEditingEvent()}">Cancelar</vaadin-button>
            <vaadin-button @click="${() => this.editAccount()}">${editButtonText(loading)}</vaadin-button>
          </div>
        </form>
      </iron-form>  
    `;
  }

  static get properties() {
    return {
      researchGroup: { type: Object },
    };
  }

  constructor() {
    super();
    this.client = Apollo.client;
    this.mutation = editMutation;
    this.onCompleted = (data) => {
      const { ok } = data.updateResearchGroup;
      if (ok) {
        this._fireEndEditingEvent();
      }
    };
  }

  _mutationData({ id, name, areas, institution, email, firstName, lastName } = {}) {
    return {
      id,
      name,
      areas,
      institution,
      owner: { email, lastName, firstName },
    };
  }

  _fireEndEditingEvent() {
    this.dispatchEvent(new CustomEvent('end-editing'));
  }

  editAccount() {
    const form = this.shadowRoot.querySelector('iron-form');
    const areasCheckbox = form.querySelector('areas-checkbox');
    const institutionsCombo = form.querySelector('institutions-combo');
    if (form.validate()) {
      const input = this._mutationData({
        ...form.serializeForm(),
        id: this.researchGroup.id,
        areas: areasCheckbox.value,
        institution: institutionsCombo.value,
      });
      this.variables = { input };
      this.mutate();
    }
  }
}

window.customElements.define('edit-research-group-form', EditResearchGroupForm);

const researchGroupQuery = Apollo.gql`
  query researchGroupDetail($id: ID!){
    researchGroup(id: $id) {
      id
      name
      canEdit
      areas { id, name }
      members { id, user { id, fullName }}
      institution { id, name , detailUrl }
      owner { id, email, firstName, lastName, fullName }
    }
  }
`;

const researchGroupInfo = (researchGroup, changeEdit) => {
  const areas = researchGroup.areas || [];
  const institution = researchGroup.institution || {};
  const owner = researchGroup.owner || {};

  return html`
    <div class="basic-info">
      <paper-button ?hidden="${!researchGroup.canEdit}" @click="${() => { changeEdit(true) }}">${editIcon}</paper-button> <br>
      <iron-image src="${researchGroup.image}" placeholder="/static/images/profile-none.png" sizing="cover" preload fade></iron-image>
      <p class="basic">
        ${researchGroup.name} <br>
        ${owner.email} <br>
        <a href="${institution.detailUrl}">${institution.name}</a> <br>
      </p>
      <div class="extra">
        <h3>Áreas de enfoque</h3>
        <ul>${areas.map((area) => html`<li>${area.name}</li>`)}</ul>
      </div>
    </div>
  `
};

class ResearchGroupDetail extends ApolloQuery {
  render() {
    const { data, editing } = this;
    const researchGroup = data && data.researchGroup ? data.researchGroup : { owner: {}, institution: {} };
    const members = researchGroup.members || [];
    const projects = researchGroup.projects || [];

    return html`
      ${SharedStyles}
      <section>
        <h2>Grupo de investigación</h2>
        ${editing 
            ? html`<edit-research-group-form .researchGroup="${researchGroup}" @end-editing="${() => this._changeEditing(false)}"></edit-research-group-form>`
            : researchGroupInfo(researchGroup, this._changeEditing.bind(this))
         }
      </section>
      <section>
        <h3>Integrantes</h3>
        <ul>
          <li><user-info .user="${researchGroup.owner}"></user-info></li>
          ${members.map((member) => html`<li><user-info .user=${member.user}></user-info></li>`)}
        </ul>
      </section>
      <section>
        <h3>Proyectos</h3>
        <paper-button ?hidden="${!researchGroup.canEdit}" @click="${() => this.shadowRoot.querySelector('new-project').opened = true}">${addIcon} nuevo</paper-button>
        <ul>${projects.map((project) => html`<li><project-info .project=${project}></project-info></li>`)}</ul>
        <new-project></new-project>
      </section>
    `;
  }

  static get properties() {
    return {
      editing: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.editing = false;
    this.client = Apollo.client;
    this.query = researchGroupQuery;
  }

  shouldUpdate(changedProperties) {
    return super.shouldUpdate(changedProperties) || (changedProperties.has('editing') && !!this.data);
  }

  set researchGroupId(id) {
    this.variables = { id };
  }

  _changeEditing(value) {
    this.editing = value;
  }
}

window.customElements.define('research-group-detail', ResearchGroupDetail);

class CosmodoxResearchGroup extends PageViewElement {
  render() {
    const { params } = this;

    return html`
      ${SharedStyles}
      <research-group-detail .researchGroupId="${params.id}"></research-group-detail>
    ` 
  }

  static get properties() {
    return {
      params: { type: Object },
    };
  }
}

window.customElements.define('cosmodox-research-group', CosmodoxResearchGroup);
