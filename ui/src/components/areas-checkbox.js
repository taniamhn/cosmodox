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
import '@vaadin/vaadin-checkbox/theme/material/vaadin-checkbox.js';

const areasQuery = Apollo.gql`
  query areasCheckboxQuery {
    areas {
      results { id, name }
    }
  }
`;

class AreasCheckbox extends ApolloQuery {
  render() {
    const { data, _value } = this;
    const areas = data.areas.results;

    return html`
      <label>Áreas de enfoque</label> <br>
      ${areas.map(area => html`<vaadin-checkbox ?checked="${_value.includes(area.id)}" value="${area.id}">${area.name}</vaadin-checkbox>`)} <br>
    `;
  }

  static get properties() {
    return {
      _value: { type: Array },
    };
  }

  constructor() {
    super();
    this._value = [];
    this.client = Apollo.client;
    this.query = areasQuery;
  }

  shouldUpdate(changedProperties) {
    return super.shouldUpdate(changedProperties) || (changedProperties.has('_value') && !!this.data);
  }

  set value(value) {
    this._value = value;
  }

  get value() {
    const checkboxElements = [...this.shadowRoot.querySelectorAll('vaadin-checkbox')];
    return checkboxElements.filter(e => e.checked).map(e => e.value);
  }
}

window.customElements.define('areas-checkbox', AreasCheckbox);
