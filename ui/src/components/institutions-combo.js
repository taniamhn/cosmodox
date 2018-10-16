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
import '@vaadin/vaadin-combo-box/theme/material/vaadin-combo-box.js';

const institutionsQuery = Apollo.gql`
  query institutionsComboQuery {
    institutions {
      results { id, name }
    }
  }
`;

class InstitutionsCombo extends ApolloQuery {
  render() {
    const { data, required } = this;
    const institutions = data.institutions.results;

    return html`
      <style>
        vaadin-combo-box {
          width: 100%;
        }
      </style>
      <vaadin-combo-box .items="${institutions}" ?required="${required}" 
        label="Institución"  item-label-path="name" item-value-path="id">
      </vaadin-combo-box>
    `;
  }

  static get properties() {
    return {
      required: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.required = false;
    this.client = Apollo.client;
    this.query = institutionsQuery;
  }

  shouldUpdate(changedProperties) {
    return super.shouldUpdate(changedProperties) || (changedProperties.has('required') && !!this.data);
  }

  get value() {
    const comboBox = this.shadowRoot.querySelector('vaadin-combo-box');
    return comboBox ? comboBox.value : '';
  }

  validate() {
    return this.shadowRoot.querySelector('vaadin-combo-box').validate();
  }
}

window.customElements.define('institutions-combo', InstitutionsCombo);
