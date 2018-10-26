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
import './education-levels-combo.js';
import './join-research-group.js';
import './new-project.js';
import './project-info.js';
import './areas-checkbox.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

const editMutation = Apollo.gql`
  mutation updatePersonalAccount($input: PersonalUpdateGenericType!) {
    updatePersonalAccount(input: $input) {
      ok
      errors { field, messages }
      personal { 
        id
        educationLevel
        educationLevelLabel
        areas { id, name }
        user { id, email, firstName, lastName, fullName }
      }
    }
  }
`;

const editButtonText = loading => html`${loading ? html`<concrete-loading-icon></concrete-loading-icon>` : html`Editar`}`;

class EditUserForm extends ApolloMutation {
  render() {
    const { loading, personalAccount } = this;
    const user = personalAccount.user || {};
    const areas = personalAccount.areas || [];

    return html`
      <style>
        form {
          display: grid;
        }
      </style>
      <iron-form>
        <form>
          <vaadin-text-field name="firstName" label="Nombres" required .value="${user.firstName}"></vaadin-text-field>
          <vaadin-text-field name="lastName" label="Apellidos" required .value="${user.lastName}"></vaadin-text-field>
          <vaadin-text-field name="email" label="Email" type="email" required .value="${user.email}"></vaadin-text-field>
          <education-levels-combo name="educationLevel" required .value="${personalAccount.educationLevel}"></education-levels-combo>
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
      personalAccount: { type: Object },
    };
  }

  constructor() {
    super();
    this.client = Apollo.client;
    this.mutation = editMutation;
    this.onCompleted = (data) => {
      const { ok } = data.updatePersonalAccount;
      if (ok) {
        this._fireEndEditingEvent();
      }
    };
  }

  _mutationData({ id, name, areas, educationLevel, email, firstName, lastName } = {}) {
    return {
      id,
      name,
      areas,
      educationLevel,
      user: { email, lastName, firstName },
    };
  }

  _fireEndEditingEvent() {
    this.dispatchEvent(new CustomEvent('end-editing'));
  }

  editAccount() {
    const form = this.shadowRoot.querySelector('iron-form');
    const areasCheckbox = form.querySelector('areas-checkbox');
    const educationLevelCombo = form.querySelector('education-levels-combo');
    if (form.validate()) {
      const input = this._mutationData({
        ...form.serializeForm(),
        areas: areasCheckbox.value,
        id: this.personalAccount.id,
        educationLevel: educationLevelCombo.value,
      });
      this.variables = { input };
      this.mutate();
    }
  }
}

window.customElements.define('edit-user-form', EditUserForm);

const personalAccountQuery = Apollo.gql`
  query personalAccountDetail($id: ID!){
    personalAccount(id: $id) {
      id
      canEdit
      educationLevel
      educationLevelLabel
      areas { id, name }
      researchGroups { id, name, detailUrl }
      user { id, email, firstName, lastName, fullName }
    }
  }
`;

const personalAccountInfo = (personalAccount, changeEdit) => {
  const areas = personalAccount.areas || [];
  const user = personalAccount.user || {};

  return html`
    <div class="basic-info">
      <paper-button ?hidden="${!personalAccount.canEdit}" @click="${() => { changeEdit(true) }}">${editIcon}</paper-button>
      <iron-image src="${personalAccount.image}" placeholder="/static/images/profile-none.png" sizing="cover" preload fade></iron-image>
      <p class="basic">
        ${user.fullName} <br>
        ${user.email} <br>
        ${personalAccount.educationLevelLabel}
      </p>
      <div class="extra">
        <h3>Áreas de enfoque</h3>
        <ul>${areas.map((area) => html`<li>${area.name}</li>`)}</ul>
      </div>
    </div>
  `;
};

class PersonalAccountDetail extends ApolloQuery {
  render() {
    const { data, editing } = this;
    const personalAccount = data && data.personalAccount ? data.personalAccount : { user: {} };
    const { researchGroups = [], projects = [] } = personalAccount;
    
    return html`
      ${SharedStyles}
      <section>
        <h2>Perfil</h2>
        ${editing 
            ? html`<edit-user-form .personalAccount="${personalAccount}" @end-editing="${() => this._changeEditing(false)}"></edit-user-form>`
            : personalAccountInfo(personalAccount, this._changeEditing.bind(this))
         }
      </section>
      <section>
        <h3>Grupos de investigación</h3>
        <paper-button ?hidden="${!personalAccount.canEdit}" @click="${() => this.shadowRoot.querySelector('join-research-group').opened = true}">unirse</paper-button>
        <ul>${researchGroups.map((group) => html`<li><a href="${group.detailUrl}">${group.name}</a></li>`)}</ul>
        <join-research-group></join-research-group>
      </section>
      <section>
        <h3>Proyectos</h3>
        <paper-button ?hidden="${!personalAccount.canEdit}" @click="${() => this.shadowRoot.querySelector('new-project').opened = true}">${addIcon} nuevo</paper-button>
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
    this.query = personalAccountQuery;
  }

  shouldUpdate(changedProperties) {
    return super.shouldUpdate(changedProperties) || (changedProperties.has('editing') && !!this.data);
  }

  set personalAccountId(id) {
    this.variables = { id };
  }

  _changeEditing(value) {
    this.editing = value;
  }
}

window.customElements.define('personal-account-detail', PersonalAccountDetail);

class CosmodoxProfile extends PageViewElement {
  render() {
    const { params } = this;

    return html`
      ${SharedStyles}
      <personal-account-detail .personalAccountId="${params.id}"></personal-account-detail>
    `
  }

  static get properties() {
    return {
      params: { type: Object },
    };
  }
}

window.customElements.define('cosmodox-profile', CosmodoxProfile);
