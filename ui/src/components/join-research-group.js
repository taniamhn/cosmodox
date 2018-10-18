/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from '@polymer/lit-element';
import { ApolloMutation } from 'lit-apollo/apollo-mutation';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dialog/paper-dialog.js';
import 'concrete-elements/src/elements/ConcreteLoadingIcon.js';
import '@vaadin/vaadin-button/theme/material/vaadin-button.js';

const joinGroupMutation = Apollo.gql`
  mutation joinResearchGroup($input: JoinResearchGroupInput!) {
    joinResearchGroup(input: $input) {
      ok
      errors { field, messages }
    }
  }
`;

const joinButtonText = loading => html`${loading ? html`<concrete-loading-icon></concrete-loading-icon>` : 'unirse'}`;

class JoinResearchGroup extends ApolloMutation {
  render() {
    const { opened, loading } = this;

    return html`
      <style>
        paper-dialog {
          width: 60%;
        }
      </style>
      <paper-dialog ?opened=${opened} modal>
        <h2>Unirse a grupo</h2>
        <iron-form>
          <form>
            <paper-input name="group" label="Grupo de investigación *" required></paper-input>
          </form>
        </iron-form>
        <div class="buttons">
          <vaadin-button @click="${() => { this.opened = false; }}">Cancelar</vaadin-button>
          <vaadin-button @click="${() => this.joinGroup()}">${joinButtonText(loading)}</vaadin-button>
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
    this.mutation = joinGroupMutation;
    this.refetchQueries = ['personalAccountDetail'];
    this.onCompleted = (data) => {
      const { ok } = data.joinResearchGroup;
      if (ok) {
        this.opened = false;
      }
    };
  }

  _mutationData({ group } = {}) {
    return { input: { group } };
  }

  joinGroup() {
    const form = this.shadowRoot.querySelector('iron-form');
    if (form.validate()) {
      this.variables = this._mutationData(form.serializeForm());
      this.mutate();
    }
  }
}

window.customElements.define('join-research-group', JoinResearchGroup);
