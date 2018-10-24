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
import '@polymer/paper-input/paper-textarea';
import '@polymer/paper-dialog/paper-dialog.js';
import 'concrete-elements/src/elements/ConcreteLoadingIcon.js';
import '@vaadin/vaadin-button/theme/material/vaadin-button.js';
import '@vaadin/vaadin-upload/theme/material/vaadin-upload.js';

const createMutation = Apollo.gql`
  mutation createProjectUpdate($input: ProjectUpdateInput!) {
    createProjectUpdate(input: $input) {
      ok
      errors { field, messages }
    }
  }
`;

const createButtonText = loading => html`${loading ? html`<concrete-loading-icon></concrete-loading-icon>` : 'Crear'}`;

class NewProjectUpdate extends ApolloMutation {
  render() {
    const { opened, loading } = this;

    return html`
      <style>
        form {
          display: grid;
        }

        paper-dialog {
          width: 60%;
        }
      </style>
      <paper-dialog ?opened=${opened} modal>
        <h2>Nueva actualización</h2>
        <iron-form>
          <form>
            <paper-textarea name="content" label="Contenido *" required></paper-textarea>
            <vaadin-upload no-auto></vaadin-upload>
          </form>
        </iron-form>
        <div class="buttons">
          <vaadin-button @click="${() => { this.opened = false; }}">Cancelar</vaadin-button>
          <vaadin-button @click="${() => this.createProjectUpdate()}">${createButtonText(loading)}</vaadin-button>
        </div>
      </paper-dialog>
    `;
  }

  static get properties() {
    return {
      opened: { type: Boolean },
      projectId: { type: String },
    };
  }

  constructor() {
    super();
    this.opened = false;
    this.client = Apollo.client;
    this.mutation = createMutation;
    this.refetchQueries = ['projectDetail']
    this.onCompleted = (data) => {
      const { ok } = data.createProjectUpdate;
      if (ok) {
        this.opened = false;
        this.shadowRoot.querySelector('iron-form').reset();
        this.shadowRoot.querySelector('vaadin-upload').files = [];
      }
    };
  }

  _mutationData({ content, projectId, files } = {}) {
    return {
      input: {
        files,
        content,
        project: projectId,
      },
    };
  }

  createProjectUpdate() {
    const form = this.shadowRoot.querySelector('iron-form');
    const upload = this.shadowRoot.querySelector('vaadin-upload');
    if (form.validate()) {
      this.variables = this._mutationData({
        files: [...upload.files],
        ...form.serializeForm(),
        projectId: this.projectId,
      });

      this.mutate();
    }
  }
}

window.customElements.define('new-project-update', NewProjectUpdate);
