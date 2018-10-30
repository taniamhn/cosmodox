import{html,ApolloQuery,PageViewElement,SharedStyles}from"./my-app.js";const allProjectsQuery=Apollo.gql`
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
`;class AllProjects extends ApolloQuery{render(){const{data}=this,projects=data&&data.projects?data.projects.results:[];return html`<project-list .projects="${projects}"></project-list>`}constructor(){super();this.client=Apollo.client;this.query=allProjectsQuery}}window.customElements.define("all-projects",AllProjects);class CosmodoxProjects extends PageViewElement{render(){return html`
      ${SharedStyles}
      <section>
        <h2>Proyectos</h2>
        <all-projects></all-projects>
      </section>
    `}}window.customElements.define("cosmodox-projects",CosmodoxProjects);