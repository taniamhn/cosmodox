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
import { ApolloMutation } from 'lit-apollo/apollo-mutation';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea';
import '@polymer/paper-dialog/paper-dialog.js';
import 'concrete-elements/src/elements/ConcreteLoadingIcon.js';
import '@vaadin/vaadin-button/theme/material/vaadin-button.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@vaadin/vaadin-combo-box/theme/material/vaadin-combo-box.js';
import './areas-checkbox.js';

const createMutation = Apollo.gql`
  mutation createProject($input: ProjectCreateGenericType!) {
    createProject(input: $input) {
      ok
      errors { field, messages }
      project { id, detailUrl }
    }
  }
`;

const createButtonText = loading => html`${loading ? html`<concrete-loading-icon></concrete-loading-icon>` : 'Crear'}`;

class NewProject extends ApolloMutation {
  render() {
    const { opened, loading } = this;

    return html`
      <style>
        form {
          display: grid;
        }

        paper-dialog {
          width: 90%;
        }

        @media (min-width: 460px) {
          paper-dialog {
            width: 70%;
          }
        }
      </style>
      <paper-dialog ?opened=${opened} modal>
        <h2>Nuevo proyecto</h2>
        <paper-dialog-scrollable>
          <iron-form>
            <form>
              <paper-input name="name" label="Nombre *" required></paper-input>
              <paper-input name="theme" label="Tema *" required></paper-input>
              <paper-input name="vinculatedInstitutions" label="Instituciones vinculadas"></paper-input>
              <areas-checkbox name="areas"></areas-checkbox>
              <paper-textarea name="description" label="Descripción"></paper-textarea>
            </form>
          </iron-form>
        </paper-dialog-scrollable>
        <div class="buttons">
          <vaadin-button @click="${() => { this.opened = false; }}">Cancelar</vaadin-button>
          <vaadin-button @click="${() => this.createProject()}">${createButtonText(loading)}</vaadin-button>
        </div>
      </paper-dialog>
    `;
  }

  static get properties() {
    return {
      opened: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.opened = false;
    this.client = Apollo.client;
    this.mutation = createMutation;
    this.onCompleted = (data) => {
      const { ok, project } = data.createProject;
      if (ok) {
        this.opened = false;
        window.location = project.detailUrl
      }
    };
  }

  _mutationData({ name, theme, areas, vinculatedInstitutions, description } = {}) {
    return {
      input: {
        name,
        theme,
        areas,
        description,
        vinculatedInstitutions,
      },
    };
  }

  createProject() {
    const form = this.shadowRoot.querySelector('iron-form');
    const areasCheckbox = form.querySelector('areas-checkbox');
    if (form.validate()) {
      this.variables = this._mutationData({
        ...form.serializeForm(),
        areas: areasCheckbox.value,
      });
      this.mutate();
    }
  }
}

window.customElements.define('new-project', NewProject);
