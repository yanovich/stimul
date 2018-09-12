import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo';
import  { gql } from 'apollo-boost';
export default class Proj extends Component {
  render() {
    let title = "";
    let __typename = "projectgroup";
      if(this.props.proj.__typename === "ProjectGroup" && this.props.end == 1){__typename = 'projects'}
      else if(this.props.proj.__typename === "ProjectGroup"){__typename = 'projectgroup'}
      else if(this.props.proj.__typename === "Project"){__typename = 'project'}
      else{}
      return (
        <Query query={GCOL_BID} variables={{pid: this.props.proj.id}}>
        {({ loading, error, data, refetch }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
          let hmcols = data.columns.length;
          let hmtasks = (data)=>{
            let col = 0;
            data.forEach((el, i, arr) => {
                col += el.tasks.length;   
            });
            return col;
          }
          
          return(
            <Link className="card no-underline ma1" to={`/${__typename}/${this.props.proj.id}`} type={this.props.proj.__typename} end={this.props.end}>
            <h2 className="card-name f3 black-80 fw4 lh-solid">{this.props.proj.title}{this.props.proj.name}</h2>
            <p className="card-id black-80 fw3">id {this.props.proj.id}</p>
 
            <div className="semafor">
            <span className="y">2</span>
            <span className="g">5</span>
            <span className="r">1</span>
            </div>
          </Link>
          )

        }}
        </Query>

      )
  }
}
export const GCOL_BID = gql`
query getByPid($pid: Int!) {
  columns(projectId: $pid){
    name
    order
    id
    project {
      id
    }
    tasks {
      id
      name
      description
    }
  }
}
`