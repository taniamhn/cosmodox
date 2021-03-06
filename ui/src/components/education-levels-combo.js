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

const educationLevelsQuery = Apollo.gql`
  query educationLevelsCombo {
    educationLevels: __type(name: "PersonalEducationLevelEnum") {
      enumValues { value: name, description }
    }
  }
`;

class EducationLevelsCombo extends ApolloQuery {
  render() {
    const { data, required } = this;
    const educationLevels = data.educationLevels.enumValues;

    return html`
      <style>
        vaadin-combo-box {
          width: 100%;
        }
      </style>
      <vaadin-combo-box .items="${educationLevels}" ?required="${required}" .value="${this._value}" 
        label="Nivel educativo"  item-label-path="description" item-value-path="value" @change="${(e) => { this.value = e.target.value; }}">
      </vaadin-combo-box>
    `;
  }

  static get properties() {
    return {
      _value: { type: String },
      required: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.required = false;
    this.client = Apollo.client;
    this.query = educationLevelsQuery;
  }

  shouldUpdate(changedProperties) {
    return super.shouldUpdate(changedProperties) || ((changedProperties.has('_value') || changedProperties.has('required')) && !!this.data);
  }

  set value(value) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  validate() {
    return this.shadowRoot.querySelector('vaadin-combo-box').validate();
  }
}

window.customElements.define('education-levels-combo', EducationLevelsCombo);
