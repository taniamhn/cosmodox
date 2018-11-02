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
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@vaadin/vaadin-button/theme/material/vaadin-button.js';
import 'concrete-elements/src/elements/ConcreteLoadingIcon.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-dialog/paper-dialog.js';
import './comment-list.js';

const createMutation = Apollo.gql`
  mutation createProjectUpdateComment($input: ProjectUpdateCommentCreateGenericType!) {
    createProjectUpdateComment(input: $input) {
      ok
      errors { field, messages }
    }
  }
`;

const commentButtonText = loading => html`${loading ? html`<concrete-loading-icon></concrete-loading-icon>` : 'Comentar'}`;

class NewProjectUpdateComment extends ApolloMutation {
  render() {
    const { loading } = this;

    return html`
      <style>
        form {
          display: grid;
        }
      </style>
      <paper-textarea required></paper-textarea>
      <vaadin-button @click="${() => this.comment()}">${commentButtonText(loading)}</vaadin-button>
    `;
  }

  static get properties() {
    return {
      projectUpdateId: { type: String },
    };
  }

  constructor() {
    super();
    this.client = Apollo.client;
    this.mutation = createMutation;
    this.refetchQueries = ['projectUpdateComments'];
    this.onCompleted = (data) => {
      const { ok } = data.createProjectUpdateComment;
      if (ok) {
        this.shadowRoot.querySelector('paper-textarea').value = '';
      }
    };
  }

  _mutationData({ projectUpdate, content } = {}) {
    return {
      input: { projectUpdate, content },
    };
  }

  comment() {
    const textarea = this.shadowRoot.querySelector('paper-textarea');
    if (textarea.validate()) {
      this.variables = this._mutationData({
        projectUpdate: this.projectUpdateId,
        content: textarea.value,
      });
      this.mutate();
    }
  }
}

window.customElements.define('new-project-update-comment', NewProjectUpdateComment);

const commentsQuery = Apollo.gql`
  query projectUpdateComments($projectUpdate: ID!) {
    projectUpdateComments(projectUpdate: $projectUpdate) {
      results {
        id
        content
        createdAt
        createdBy { id, fullName }
      }
    }
  }
`;

class ProjectUpdateComments extends ApolloQuery {
  render() {
    const { data, opened, _projectUpdateId } = this;
    const comments = data && data.projectUpdateComments ? data.projectUpdateComments : { results: [] };

    return html`
      <style>
        :host {
          display: block;
        }

        paper-dialog {
          width: 100%;
          height: 100%;
        }

        comment-list {
          height: 60vh;
        }
      </style>
      <paper-dialog ?opened=${opened} modal>
        <h2>Comentarios</h2>
        <paper-dialog-scrollable>
          <new-project-update-comment .projectUpdateId="${_projectUpdateId}"></new-project-update-comment>
          <comment-list .comments="${comments.results}"></comment-list>
        </paper-dialog-scrollable>
        <div class="buttons">
          <vaadin-button @click="${() => { this.opened = false; }}">Cerrar</vaadin-button>
        </div>
      </paper-dialog>
    `;
  }

  static get properties() {
    return {
      opened: { type: Boolean },
      _projectUpdateId: { type: String },
    };
  }

  constructor() {
    super();
    this.opened = false;
    this.client = Apollo.client;
    this.query = commentsQuery;
  }

  shouldUpdate(changedProperties) {
    return (changedProperties.has('opened') && !!this.data) || (changedProperties.has('_projectUpdateId') && !!this.data) || super.shouldUpdate(changedProperties);
  }

  set projectUpdateId(id) {
    this._projectUpdateId = id;
    this.variables = { projectUpdate: id };
  }
}

window.customElements.define('project-update-comments', ProjectUpdateComments);
