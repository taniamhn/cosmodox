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
  mutation createProjectComment($input: ProjectCommentCreateGenericType!) {
    createProjectComment(input: $input) {
      ok
      errors { field, messages }
    }
  }
`;

const commentButtonText = loading => html`${loading ? html`<concrete-loading-icon></concrete-loading-icon>` : 'Comentar'}`;

class NewProjectComment extends ApolloMutation {
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
      projectId: { type: String },
    };
  }

  constructor() {
    super();
    this.client = Apollo.client;
    this.mutation = createMutation;
    this.refetchQueries = ['projectComments'];
    this.onCompleted = (data) => {
      const { ok } = data.createProjectComment;
      if (ok) {
        this.shadowRoot.querySelector('paper-textarea').value = '';
      }
    };
  }

  _mutationData({ project, content } = {}) {
    return {
      input: { project, content },
    };
  }

  comment() {
    const textarea = this.shadowRoot.querySelector('paper-textarea');
    if (textarea.validate()) {
      this.variables = this._mutationData({
        project: this.projectId,
        content: textarea.value,
      });
      this.mutate();
    }
  }
}

window.customElements.define('new-project-comment', NewProjectComment);

const commentsQuery = Apollo.gql`
  query projectComments($project: ID!) {
    projectComments(project: $project) {
      results {
        id
        content
        createdAt
        createdBy { id, fullName }
      }
    }
  }
`;

class ProjectComments extends ApolloQuery {
  render() {
    const { data, opened, _projectId } = this;
    const comments = data && data.projectComments ? data.projectComments : { results: [] };

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
          <new-project-comment .projectId="${_projectId}"></new-project-comment>
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
      _projectId: { type: String },
    };
  }

  constructor() {
    super();
    this.opened = false;
    this.client = Apollo.client;
    this.query = commentsQuery;
  }

  shouldUpdate(changedProperties) {
    return (changedProperties.has('opened') && !!this.data) || (changedProperties.has('_projectId') && !!this.data) || super.shouldUpdate(changedProperties);
  }

  set projectId(id) {
    this._projectId = id;
    this.variables = { project: id };
  }
}

window.customElements.define('project-comments', ProjectComments);
