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

const commentInfo = (comment) => {
  const { content, createdAt, createdBy } = comment;
  return html`
    <div>
      <p>${content}</p>
      <time>${createdAt}</time>
      <span>${createdBy.fullName}</span>
    </div>
  `;
};

class CommentList extends LitElement {
  render() {
    const { comments } = this;

    return html`
      <style>
        :host {
          display: block;
        }

        p {
          margin: 0;
        }

        li {
          padding: 10px;
          border: 1px solid;
          border-radius: 10px;
          margin-bottom: 10px;
          list-style-type: none;
        }
      </style>
      <ul>
        ${comments.map(comment => html`<li>${commentInfo(comment)}</li>`)}
      </ul>
    `;
  }

  static get properties() {
    return {
      comments: { type: Array },
    };
  }

  constructor() {
    super();
    this.comments = [];
  }
}

window.customElements.define('comment-list', CommentList);
