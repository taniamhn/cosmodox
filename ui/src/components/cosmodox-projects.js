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
import { PageViewElement } from './page-view-element.js';
import './project-list.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

const allProjectsQuery = Apollo.gql`
  query allProjects {
    projects {
      results {
        id
        name
        detailUrl
        image { url }
      }
    }
  }
`;

class AllProjects extends ApolloQuery {
  render() {
    const { data } = this;
    const projects = data && data.projects ? data.projects.results : [];
    return html`<project-list .projects="${projects}"></project-list>`;
  }

  constructor() {
    super();
    this.client = Apollo.client;
    this.query = allProjectsQuery;
  }
}

window.customElements.define('all-projects', AllProjects);

class CosmodoxProjects extends PageViewElement {
  render() {
    return html`
      ${SharedStyles}
      <section>
        <h2>Proyectos</h2>
        <all-projects></all-projects>
      </section>
    `;
  }
}

window.customElements.define('cosmodox-projects', CosmodoxProjects);
