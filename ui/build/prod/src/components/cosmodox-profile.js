import{html,ApolloQuery,ApolloMutation,PageViewElement,addIcon,editIcon,SharedStyles}from"./my-app.js";const editMutation=Apollo.gql`
  mutation updatePersonalAccount($input: PersonalUpdateGenericType!) {
    updatePersonalAccount(input: $input) {
      ok
      errors { field, messages }
      personal { 
        id
        educationLevel
        educationLevelLabel
        areas { id, name }
        user { id, email, firstName, lastName, fullName }
      }
    }
  }
`,editButtonText=loading=>html`${loading?html`<concrete-loading-icon></concrete-loading-icon>`:html`Editar`}`;class EditUserForm extends ApolloMutation{render(){const{loading,personalAccount}=this,user=personalAccount.user||{},areas=personalAccount.areas||[];return html`
      <style>
        form {
          display: grid;
        }
      </style>
      <iron-form>
        <form>
          <vaadin-text-field name="firstName" label="Nombres" required .value="${user.firstName}"></vaadin-text-field>
          <vaadin-text-field name="lastName" label="Apellidos" required .value="${user.lastName}"></vaadin-text-field>
          <vaadin-text-field name="email" label="Email" type="email" required .value="${user.email}"></vaadin-text-field>
          <education-levels-combo name="educationLevel" required .value="${personalAccount.educationLevel}"></education-levels-combo>
          <areas-checkbox name="areas" .value="${areas.map(a=>a.id)}"></areas-checkbox>
          <div>
            <vaadin-button @click="${()=>this._fireEndEditingEvent()}">Cancelar</vaadin-button>
            <vaadin-button @click="${()=>this.editAccount()}">${editButtonText(loading)}</vaadin-button>
          </div>
        </form>
      </iron-form>
    `}static get properties(){return{personalAccount:{type:Object}}}constructor(){super();this.client=Apollo.client;this.mutation=editMutation;this.onCompleted=data=>{const{ok}=data.updatePersonalAccount;if(ok){this._fireEndEditingEvent()}}}_mutationData({id,name,areas,educationLevel,email,firstName,lastName}={}){return{id,name,areas,educationLevel,user:{email,lastName,firstName}}}_fireEndEditingEvent(){this.dispatchEvent(new CustomEvent("end-editing"))}editAccount(){const form=this.shadowRoot.querySelector("iron-form"),areasCheckbox=form.querySelector("areas-checkbox"),educationLevelCombo=form.querySelector("education-levels-combo");if(form.validate()){const input=this._mutationData({...form.serializeForm(),areas:areasCheckbox.value,id:this.personalAccount.id,educationLevel:educationLevelCombo.value});this.variables={input};this.mutate()}}}window.customElements.define("edit-user-form",EditUserForm);const personalAccountQuery=Apollo.gql`
  query personalAccountDetail($id: ID!){
    personalAccount(id: $id) {
      id
      canEdit
      educationLevel
      educationLevelLabel
      areas { id, name }
      projects { id, name, detailUrl, image { url } }
      user { id, email, firstName, lastName, fullName }
      researchGroups { 
        id
        name
        detailUrl
        projects { id, name, detailUrl, image { url } }
      }
    }
  }
`,personalAccountInfo=(personalAccount,changeEdit)=>{const areas=personalAccount.areas||[],user=personalAccount.user||{};return html`
    <div class="basic-info">
      <paper-button ?hidden="${!personalAccount.canEdit}" @click="${()=>{changeEdit(!0)}}">${editIcon}</paper-button>
      <iron-image src="${personalAccount.image}" placeholder="/static/images/profile-none.png" sizing="cover" preload fade></iron-image>
      <p class="basic">
        ${user.fullName} <br>
        ${user.email} <br>
        ${personalAccount.educationLevelLabel}
      </p>
      <div class="extra">
        <h3>Áreas de enfoque</h3>
        <ul>${areas.map(area=>html`<li>${area.name}</li>`)}</ul>
      </div>
    </div>
  `};class PersonalAccountDetail extends ApolloQuery{render(){const{data,editing}=this,personalAccount=data&&data.personalAccount?data.personalAccount:{user:{}},{researchGroups=[],projects=[]}=personalAccount;return html`
      ${SharedStyles}
      <section>
        <h2>Perfil</h2>
        ${editing?html`<edit-user-form .personalAccount="${personalAccount}" @end-editing="${()=>this._changeEditing(!1)}"></edit-user-form>`:personalAccountInfo(personalAccount,this._changeEditing.bind(this))}
      </section>
      <section>
        <h3>Proyectos personales</h3>
        <paper-button ?hidden="${!personalAccount.canEdit}" @click="${()=>this.shadowRoot.querySelector("new-project").opened=!0}">${addIcon} nuevo</paper-button>
        <project-list .projects="${projects}"></project-list>
        <new-project></new-project>        
      </section>
      <section>
        <h3>Grupos de investigación</h3>
        <paper-button ?hidden="${!personalAccount.canEdit}" @click="${()=>this.shadowRoot.querySelector("join-research-group").opened=!0}">unirse</paper-button>
        <ul>${researchGroups.map(group=>{const{projects=[]}=group;return html`
            <li>
              <a href="${group.detailUrl}"><span class="group">${group.name}</span></a>
              <project-list .projects="${projects}"></project-list>
            </li>`})}</ul>
        <join-research-group></join-research-group>
      </section>
    `}static get properties(){return{editing:{type:Boolean}}}constructor(){super();this.editing=!1;this.client=Apollo.client;this.query=personalAccountQuery}shouldUpdate(changedProperties){return super.shouldUpdate(changedProperties)||changedProperties.has("editing")&&!!this.data}set personalAccountId(id){this.variables={id}}_changeEditing(value){this.editing=value}}window.customElements.define("personal-account-detail",PersonalAccountDetail);class CosmodoxProfile extends PageViewElement{render(){const{params}=this;return html`
      ${SharedStyles}
      <personal-account-detail .personalAccountId="${params.id}"></personal-account-detail>
    `}static get properties(){return{params:{type:Object}}}}window.customElements.define("cosmodox-profile",CosmodoxProfile);