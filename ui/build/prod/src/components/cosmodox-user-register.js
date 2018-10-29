import{html,ApolloMutation,PageViewElement,login,SharedStyles}from"./my-app.js";const createMutation=Apollo.gql`
  mutation createPersonalAccount($input: PersonalCreateGenericType!) {
    createPersonalAccount(input: $input) {
      ok
      errors { field, messages }
      personal { id, detailUrl }
    }
  }
`,createButtonText=loading=>html`${loading?html`<concrete-loading-icon></concrete-loading-icon>`:html`Crear cuenta`}`;class UserRegisterForm extends ApolloMutation{render(){const{loading}=this;return html`
      <style>
        form {
          display: grid;
        }
      </style>
      <iron-form>
        <form>
          <vaadin-text-field name="firstName" label="Nombres" required></vaadin-text-field>
          <vaadin-text-field name="lastName" label="Apellidos" required></vaadin-text-field>
          <vaadin-text-field name="email" label="Email" type="email" required></vaadin-text-field>
          <education-levels-combo name="educationLevel" required></education-levels-combo>
          <areas-checkbox name="areas"></areas-checkbox>
          <vaadin-password-field name="password1" label="Contraseña" required></vaadin-password-field>
          <vaadin-password-field name="password2" label="Confirmar contraseña" required></vaadin-password-field>
          <vaadin-button @click="${()=>this.createAccount()}">${createButtonText(loading)}</vaadin-button>
        </form>
      </iron-form>
    `}constructor(){super();this.client=Apollo.client;this.mutation=createMutation;this.onCompleted=data=>{const{ok,personal}=data.createPersonalAccount;if(ok){login(this);window.location=personal.detailUrl}}}_mutationData({name,areas,educationLevel,email,firstName,lastName,password1,password2}={}){return{name,areas,educationLevel,user:{email,lastName,firstName,password1,password2}}}createAccount(){const form=this.shadowRoot.querySelector("iron-form"),areasCheckbox=form.querySelector("areas-checkbox"),educationLevelCombo=form.querySelector("education-levels-combo");if(form.validate()){const input=this._mutationData({...form.serializeForm(),areas:areasCheckbox.value,educationLevel:educationLevelCombo.value});this.variables={input};this.mutate()}}}window.customElements.define("user-register-form",UserRegisterForm);class CosmodoxUserRegister extends PageViewElement{render(){return html`
      ${SharedStyles}
      <section>
        <h2>Nuevo usuario</h2>
        <user-register-form></user-register-form>
      </section>
    `}}window.customElements.define("cosmodox-user-register",CosmodoxUserRegister);