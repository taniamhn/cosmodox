import{html,ApolloMutation,PageViewElement,login,SharedStyles}from"./my-app.js";const createMutation=Apollo.gql`
  mutation createInstitution($input: InstitutionCreateGenericType!) {
    createInstitution(input: $input) {
      ok
      errors { field, messages }
      institution { id, detailUrl }
    }
  }
`,createButtonText=loading=>html`${loading?html`<concrete-loading-icon></concrete-loading-icon>`:html`Crear cuenta`}`;class InstitutionRegisterForm extends ApolloMutation{render(){const{loading}=this;return html`
      <style>
        form {
          display: grid;
        }
      </style>
      <iron-form>
        <form>
          <vaadin-text-field name="name" label="Nombre" required></vaadin-text-field>
          <vaadin-text-field name="email" label="Email" type="email" required></vaadin-text-field>
          <vaadin-text-field name="firstName" label="Nombres del responsable" required></vaadin-text-field>
          <vaadin-text-field name="lastName" label="Apellidos del responsable" required></vaadin-text-field>
          <vaadin-password-field name="password1" label="Contraseña" required></vaadin-password-field>
          <vaadin-password-field name="password2" label="Confirmar contraseña" required></vaadin-password-field>
          <vaadin-button @click="${()=>this.createAccount()}">${createButtonText(loading)}</vaadin-button>
        </form>
      </iron-form>
    `}constructor(){super();this.client=Apollo.client;this.mutation=createMutation;this.onCompleted=data=>{const{ok,institution}=data.createInstitution;if(ok){login(this);window.location=institution.detailUrl}}}_mutationData({name,email,firstName,lastName,password1,password2}={}){return{name,owner:{email,lastName,firstName,password1,password2}}}createAccount(){const form=this.shadowRoot.querySelector("iron-form");if(form.validate()){this.variables={input:this._mutationData(form.serializeForm())};this.mutate()}}}window.customElements.define("institution-register-form",InstitutionRegisterForm);class CosmodoxInstitutionRegister extends PageViewElement{render(){return html`
      ${SharedStyles}
      <section>
        <h2>Nueva institución</h2>
        <institution-register-form></institution-register-form>
      </section>
    `}}window.customElements.define("cosmodox-institution-register",CosmodoxInstitutionRegister);