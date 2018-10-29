import{LitElement,html,ApolloQuery,ApolloMutation,PageViewElement,addIcon,editIcon,SharedStyles}from"./my-app.js";class UserInfo extends LitElement{render(){const{user}=this;return html`
      <style>
        iron-image {
          width: 100px;
          height: 100px;
        }
      </style>
      <iron-image src="${user.image}" placeholder="/static/images/profile-none.png" sizing="cover" preload fade></iron-image>
      <div class="name">${user.fullName}</div>
    `}static get properties(){return{user:{type:Object}}}constructor(){super();this.user={}}}window.customElements.define("user-info",UserInfo);const editMutation=Apollo.gql`
  mutation updateResearchGroup($input: ResearchGroupUpdateGenericType!) {
    updateResearchGroup(input: $input) {
      ok
      errors { field, messages }
      researchGroup {
        id
        name
        areas { id, name }
        institution { id, name, detailUrl }
        owner { id, email, firstName, lastName, fullName }
      }
    }
  }
`,editButtonText=loading=>html`${loading?html`<concrete-loading-icon></concrete-loading-icon>`:html`Editar`}`;class EditResearchGroupForm extends ApolloMutation{render(){const{loading,researchGroup}=this,{owner,institution}=researchGroup,areas=researchGroup.areas||[];return html`
      <style>
        form {
          display: grid;
        }
      </style>
      <iron-form>
        <form>
          <vaadin-text-field name="name" label="Nombre del grupo" required .value="${researchGroup.name}"></vaadin-text-field>
          <vaadin-text-field name="email" label="Email" type="email" required .value="${owner.email}"></vaadin-text-field>
          <vaadin-text-field name="firstName" label="Nombre del lider" required .value="${owner.firstName}"></vaadin-text-field>
          <vaadin-text-field name="lastName" label="Apellido del lider" required .value="${owner.lastName}"></vaadin-text-field>
          <institutions-combo name="institution" required .value="${institution.id}"></institutions-combo>
          <areas-checkbox name="areas" .value="${areas.map(a=>a.id)}"></areas-checkbox>
          <div>
            <vaadin-button @click="${()=>this._fireEndEditingEvent()}">Cancelar</vaadin-button>
            <vaadin-button @click="${()=>this.editAccount()}">${editButtonText(loading)}</vaadin-button>
          </div>
        </form>
      </iron-form>  
    `}static get properties(){return{researchGroup:{type:Object}}}constructor(){super();this.client=Apollo.client;this.mutation=editMutation;this.onCompleted=data=>{const{ok}=data.updateResearchGroup;if(ok){this._fireEndEditingEvent()}}}_mutationData({id,name,areas,institution,email,firstName,lastName}={}){return{id,name,areas,institution,owner:{email,lastName,firstName}}}_fireEndEditingEvent(){this.dispatchEvent(new CustomEvent("end-editing"))}editAccount(){const form=this.shadowRoot.querySelector("iron-form"),areasCheckbox=form.querySelector("areas-checkbox"),institutionsCombo=form.querySelector("institutions-combo");if(form.validate()){const input=this._mutationData({...form.serializeForm(),id:this.researchGroup.id,areas:areasCheckbox.value,institution:institutionsCombo.value});this.variables={input};this.mutate()}}}window.customElements.define("edit-research-group-form",EditResearchGroupForm);const researchGroupQuery=Apollo.gql`
  query researchGroupDetail($id: ID!){
    researchGroup(id: $id) {
      id
      name
      canEdit
      areas { id, name }
      members { id, user { id, fullName } }
      institution { id, name , detailUrl }
      projects { id, name, detailUrl, image { url } }
      owner { id, email, firstName, lastName, fullName }
    }
  }
`,researchGroupInfo=(researchGroup,changeEdit)=>{const areas=researchGroup.areas||[],institution=researchGroup.institution||{},owner=researchGroup.owner||{};return html`
    <div class="basic-info">
      <paper-button ?hidden="${!researchGroup.canEdit}" @click="${()=>{changeEdit(!0)}}">${editIcon}</paper-button> <br>
      <iron-image src="${researchGroup.image}" placeholder="/static/images/profile-none.png" sizing="cover" preload fade></iron-image>
      <p class="basic">
        ${researchGroup.name} <br>
        ${owner.email} <br>
        <a href="${institution.detailUrl}">${institution.name}</a> <br>
      </p>
      <div class="extra">
        <h3>Áreas de enfoque</h3>
        <ul>${areas.map(area=>html`<li>${area.name}</li>`)}</ul>
      </div>
    </div>
  `};class ResearchGroupDetail extends ApolloQuery{render(){const{data,editing}=this,researchGroup=data&&data.researchGroup?data.researchGroup:{owner:{},institution:{}},members=researchGroup.members||[],projects=researchGroup.projects||[];return html`
      ${SharedStyles}
      <style>
        :host {
          display: block;
        }
      </style>
      <section>
        <h2>Grupo de investigación</h2>
        ${editing?html`<edit-research-group-form .researchGroup="${researchGroup}" @end-editing="${()=>this._changeEditing(!1)}"></edit-research-group-form>`:researchGroupInfo(researchGroup,this._changeEditing.bind(this))}
      </section>
      <section>
        <h3>Integrantes</h3>
        <ul>
          <li><user-info .user="${researchGroup.owner}"></user-info></li>
          ${members.map(member=>html`<li><user-info .user=${member.user}></user-info></li>`)}
        </ul>
      </section>
      <section>
        <h3>Proyectos</h3>
        <paper-button ?hidden="${!researchGroup.canEdit}" @click="${()=>this.shadowRoot.querySelector("new-project").opened=!0}">${addIcon} nuevo</paper-button>
        <project-list .projects="${projects}"></project-list>
        <new-project></new-project>
      </section>
    `}static get properties(){return{editing:{type:Boolean}}}constructor(){super();this.editing=!1;this.client=Apollo.client;this.query=researchGroupQuery}shouldUpdate(changedProperties){return super.shouldUpdate(changedProperties)||changedProperties.has("editing")&&!!this.data}set researchGroupId(id){this.variables={id}}_changeEditing(value){this.editing=value}}window.customElements.define("research-group-detail",ResearchGroupDetail);class CosmodoxResearchGroup extends PageViewElement{render(){const{params}=this;return html`
      ${SharedStyles}
      <research-group-detail .researchGroupId="${params.id}"></research-group-detail>
    `}static get properties(){return{params:{type:Object}}}}window.customElements.define("cosmodox-research-group",CosmodoxResearchGroup);