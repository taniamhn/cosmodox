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
import { editIcon } from './my-icons.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-button/paper-button.js';
import 'concrete-elements/src/elements/ConcreteLoadingIcon.js';
import '@vaadin/vaadin-checkbox/theme/material/vaadin-checkbox.js';
import '@vaadin/vaadin-combo-box/theme/material/vaadin-combo-box.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field.js';
import './new-project.js';
import './project-info.js';
import './join-research-group.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

const editMutation = Apollo.gql`
  mutation updateInstitution($input: InstitutionUpdateGenericType!) {
    updateInstitution(input: $input) {
      ok
      errors { field, messages }
      institution {
        id
        name
        owner { id, email, firstName, lastName, fullName }
      }
    }
  }
`;

const editButtonText = loading => html`${loading ? html`<concrete-loading-icon></concrete-loading-icon>` : html`Editar`}`;

class EditInstitutionForm extends ApolloMutation {
  render() {
    const { loading, institution } = this;
    const { owner } = institution;
  
    return html`
      <style>
        form {
          display: grid;
        }
      </style>
      <iron-form>
        <form>
          <vaadin-text-field name="name" label="Nombre" required value="${institution.name}"></vaadin-text-field>
          <vaadin-text-field name="email" label="Email" type="email" required value="${owner.email}"></vaadin-text-field>
          <vaadin-text-field name="firstName" label="Nombres del responsable" required value="${owner.firstName}"></vaadin-text-field>
          <vaadin-text-field name="lastName" label="Apellidos del responsable" required value="${owner.lastName}"></vaadin-text-field>
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
      institution: { type: Object },
    };
  }

  constructor() {
    super();
    this.client = Apollo.client;
    this.mutation = editMutation;
    this.onCompleted = (data) => {
      const { ok } = data.updateInstitution;
      if (ok) {
        this._fireEndEditingEvent();
      }
    };
  }

  _mutationData({ id, name, email, firstName, lastName } = {}) {
    return {
      id,
      name,
      owner: { email, lastName, firstName },
    };
  }

  _fireEndEditingEvent() {
    this.dispatchEvent(new CustomEvent('end-editing'));
  }

  editAccount() {
    const form = this.shadowRoot.querySelector('iron-form');
    if (form.validate()) {
      this.variables = { input: this._mutationData({ id: this.institution.id, ...form.serializeForm() }) };
      this.mutate();
    }
  }
}

window.customElements.define('edit-institution-form', EditInstitutionForm);

const institutionQuery = Apollo.gql`
  query institutionDetailQuery($id: ID!){
    institution(id: $id) {
      id
      name
      canEdit
      owner { id, email, firstName, lastName, fullName }
      researchGroups { id, name, detailUrl }
    }
  }
`;

const institutionInfo = (institution, changeEdit) => html`
  <div class="basic-info">
    <paper-button ?hidden="${!institution.canEdit}" @click="${() => { changeEdit(true) }}">${editIcon}</paper-button>
    <iron-image src="${institution.image}" placeholder="/static/images/profile-none.png" sizing="cover" preload fade></iron-image>
    <p class="basic">
      ${institution.name}
      <br> ${institution.owner.email}
      <br> ${institution.owner.fullName}
    </p>
  </div>
`;

class InstitutionDetail extends ApolloQuery {
  render() {
    const { data, editing } = this;
    const institution = data && data.institution ? data.institution : { owner: {}, researchGroups: [] };

    return html`
      ${SharedStyles}
      <section>
        <h2>Institución</h2>
        ${editing 
            ? html`<edit-institution-form .institution="${institution}" @end-editing="${() => this._changeEditing(false)}"></edit-institution-form>`
            : institutionInfo(institution, this._changeEditing.bind(this))
         }
      </section>
      <section>
        <h3>Grupos de investigación</h3>
        <ul>${institution.researchGroups.map(group => html`<li>${group.name}</li>`)}</ul>
        <join-research-group></join-research-group>
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
    this.query = institutionQuery;
  }

  shouldUpdate(changedProperties) {
    return super.shouldUpdate(changedProperties) || (changedProperties.has('editing') && !!this.data);
  }

  set institutionId(id) {
    this.variables = { id };
  }

  _changeEditing(value) {
    this.editing = value;
  }
}

window.customElements.define('institution-detail', InstitutionDetail);

class CosmodoxInstitution extends PageViewElement {
  render() {
    const { params } = this;

    return html`
      ${SharedStyles}
      <institution-detail .institutionId="${params.id}"></institution-detail>
    `;
  }

  static get properties() {
    return {
      params: { type: Object },
    };
  }
}

window.customElements.define('cosmodox-institution', CosmodoxInstitution);
