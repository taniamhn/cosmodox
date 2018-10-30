import{html,ApolloMutation,PageViewElement,login,SharedStyles}from"./my-app.js";const createMutation=Apollo.gql`
  mutation createResearchGroup($input: ResearchGroupCreateGenericType!) {
    createResearchGroup(input: $input) {
      ok
      errors { field, messages }
      researchGroup { id, detailUrl }
    }
  }
`,createButtonText=loading=>html`${loading?html`<concrete-loading-icon></concrete-loading-icon>`:html`Crear cuenta`}`;class ResearchGroupRegisterForm extends ApolloMutation{render(){const{loading}=this;return html`
      <style>
        form {
          display: grid;
        }
      </style>
      <iron-form>
        <form>
          <vaadin-text-field name="name" label="Nombre del grupo" required></vaadin-text-field>
          <vaadin-text-field name="email" label="Email" type="email" required></vaadin-text-field>
          <vaadin-text-field name="firstName" label="Nombre del lider" required></vaadin-text-field>
          <vaadin-text-field name="lastName" label="Apellido del lider" required></vaadin-text-field>
          <institutions-combo name="institution"></institutions-combo>
          <areas-checkbox name="areas"></areas-checkbox>
          <vaadin-password-field name="password1" label="Contraseña" required></vaadin-password-field>
          <vaadin-password-field name="password2" label="Confirmar contraseña" required></vaadin-password-field>
          <vaadin-button @click="${()=>this.createAccount()}">${createButtonText(loading)}</vaadin-button>
        </form>
      </iron-form>  
    `}constructor(){super();this.client=Apollo.client;this.mutation=createMutation;this.onCompleted=data=>{const{ok,researchGroup}=data.createResearchGroup;if(ok){login(this);window.location=researchGroup.detailUrl}}}_mutationData({name,areas,institution,email,firstName,lastName,password1,password2}={}){return{name,areas,institution,owner:{email,lastName,firstName,password1,password2}}}createAccount(){const form=this.shadowRoot.querySelector("iron-form"),areasCheckbox=form.querySelector("areas-checkbox"),institutionsCombo=form.querySelector("institutions-combo");if(form.validate()){const input=this._mutationData({...form.serializeForm(),areas:areasCheckbox.value,institution:institutionsCombo.value});this.variables={input};this.mutate()}}}window.customElements.define("research-group-register-form",ResearchGroupRegisterForm);class CosmodoxGroupRegister extends PageViewElement{render(){return html`
      ${SharedStyles}
      <section>
        <h2>Nuevo grupo</h2>
        <research-group-register-form></research-group-register-form>
      </section>
    `}}window.customElements.define("cosmodox-group-register",CosmodoxGroupRegister);