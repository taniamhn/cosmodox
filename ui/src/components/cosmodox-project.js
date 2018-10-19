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
import '@polymer/paper-checkbox/paper-checkbox.js';
import 'concrete-elements/src/elements/ConcreteLoadingIcon.js';
import '@vaadin/vaadin-checkbox/theme/material/vaadin-checkbox.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-area.js';
import './project-states-combo.js';
import './join-research-group.js';
import './areas-checkbox.js';
import './project-info.js';
import './new-project.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

const editMutation = Apollo.gql`
  mutation updateProject($input: ProjectUpdateGenericType!) {
    updateProject(input: $input) {
      ok
      errors { field, messages }
      project {
        id
        name
        theme
        state
        stateLabel
        description
        vinculatedInstitutions
        areas { id, name }
      }
    }
  }
`;

const editButtonText = loading => html`${loading ? html`<concrete-loading-icon></concrete-loading-icon>` : 'Editar'}`;

class EditProjectForm extends ApolloMutation {
  render() {
    const { loading, project } = this;
    const { areas = [] } = project;

    return html`
      <style>
        form {
          display: grid;
        }
      </style>
      <iron-form>
          <form>
          <vaadin-text-field name="name" label="Nombre" required .value="${project.name}"></vaadin-text-field>
          <vaadin-text-field name="theme" label="Tema" required .value="${project.theme}"></vaadin-text-field>
          <project-states-combo name="state" required .value="${project.state}"></project-states-combo>
          <vaadin-text-field name="vinculatedInstitutions" label="Instituciones vinculadas" .value="${project.vinculatedInstitutions}"></vaadin-text-field>
          <areas-checkbox name="areas" .value="${areas.map(a => a.id)}"></areas-checkbox>
          <vaadin-text-area name="description" label="Descripción" .value="${project.description}"></vaadin-text-area>
          <div>
            <vaadin-button @click="${() => this._fireEndEditingEvent()}">Cancelar</vaadin-button>
            <vaadin-button @click="${() => this.editProject()}">${editButtonText(loading)}</vaadin-button>
          </div>
        </form>
      </iron-form>
    `;
  }

  static get properties() {
    return {
      project: { type: Object },
    };
  }

  constructor() {
    super();
    this.client = Apollo.client;
    this.mutation = editMutation;
    this.onCompleted = (data) => {
      const { ok } = data.updateProject;
      if (ok) {
        this._fireEndEditingEvent();
      }
    };
  }

  _mutationData({ id, state, name, theme, areas, vinculatedInstitutions, description } = {}) {
    return {
      input: {
        id,
        name,
        theme,
        state,
        areas,
        description,
        vinculatedInstitutions,
      },
    };
  }

  _fireEndEditingEvent() {
    this.dispatchEvent(new CustomEvent('end-editing'));
  }

  editProject() {
    const form = this.shadowRoot.querySelector('iron-form');
    const areasCheckbox = form.querySelector('areas-checkbox');
    if (form.validate()) {
      this.variables = this._mutationData({
        ...form.serializeForm(),
        id: this.project.id,
        areas: areasCheckbox.value,
      });
      this.mutate();
    }
  }
}

window.customElements.define('edit-project-form', EditProjectForm);

const projectQuery = Apollo.gql`
  query projectDetail($id: ID!) {
    project(id: $id) {
      id
      name
      theme
      state
      canEdit
      stateLabel
      description
      vinculatedInstitutions
      areas { id, name }
      updates { id, content, createdAt, createdBy { id, fullName } }
      owner {
        id
        fullName
        profile {
          id
          detailUrl
          __typename
          ...on ResearchGroup { 
            name
          }
        }
      }
    }
  }
`;

const personalOwner = (owner, url) => html`<span>Usuario: </span> <a href="${url}">${owner.fullName}</a>`;
const researchGroupOwner = (group, url) => html`<span>Grupo de investigación: </span> <a href="${url}">${group.name}</a>`;

const ownerInfo = (owner) => {
  const { profile = {} } = owner;
  const { detailUrl, __typename } = profile;
  return __typename == 'ResearchGroup' ? personalOwner(owner, detailUrl) : researchGroupOwner(profile, detailUrl);
}

const projectInfo = (project, changeEdit) => {
  const { areas = [], owner = {} }  = project;

  return html`
    <paper-button ?hidden="${!project.canEdit}" @click="${() => { changeEdit(true) }}">${editIcon}</paper-button> <br>
    <iron-image src="${project.image}" placeholder="/static/images/profile-none.png" sizing="cover" preload fade></iron-image>
    <p>
      <span>Nombre: </span>${project.name} <br>
      <span>Tema: </span>${project.theme} <br>
      ${ownerInfo(owner)} <br>
      <span>Estado: </span>${project.stateLabel} <br>
      <span>Instituciones vinculadas: </span>${project.vinculatedInstitutions} <br>
    </p>
    <h3>Áreas de enfoque</h3>
    <ul>${areas.map((area) => html`<li>${area.name}</li>`)}</ul>
    <span>Descripción</span>
    <p>${project.description}</p>
  `
};

class ProjectDetail extends ApolloQuery {
  render() {
    const { data, editing } = this;
    const project = data && data.project ? data.project : { owner: {} };
    const { updates = [] } = project;

    return html`
      ${SharedStyles}
      <section>
        <h2>Proyecto</h2>
        ${editing
          ? html`<edit-project-form .project="${project}" @end-editing="${() => this._changeEditing(false)}"></edit-project-form>`
          : projectInfo(project, this._changeEditing.bind(this))
        }
      </section>
      <section>
        <h3>Actualizaciones</h3>
        <div>
          <h6>purfect</h6>
          <p></p>
        </div>
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
    this.query = projectQuery;
  }

  shouldUpdate(changedProperties) {
    return (changedProperties.has('editing') && !!this.data) || super.shouldUpdate(changedProperties);
  }

  set projectId(id) {
    this.variables = { id };
  }

  _changeEditing(value) {
    this.editing = value;
  }
}

window.customElements.define('project-detail', ProjectDetail);

class CosmodoxProject extends PageViewElement {
  render() {
    const { params } = this;

    return html`
      ${SharedStyles}
      <project-detail .projectId="${params.id}"></project-detail>
    `
  }

  static get properties() {
    return {
      params: { type: Object },
    };
  }
}

window.customElements.define('cosmodox-project', CosmodoxProject);
