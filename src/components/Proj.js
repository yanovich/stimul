import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
// import AddGroup from './AddGroup';
import { quf } from '../constants';



const delPRG = (thisid) => {
  return (
    `mutation{
          deleteProjectGroup(id: ${thisid})
      }`
  )
};


export default class Proj extends Component {
  constructor(props) {
    super(props)
    this.state = {
      input: [],
    };
    this.delete = this.delete.bind(this);
  }

  delete() {
    let id = this.props.proj.id;
    let crprg = delPRG(id);
    quf(crprg);
    this.props.refresh()
    this.setState({
      input: [],
    });
  }



  render() {
    let title = "";
    let __typename = "projectgroup";
    let projlen = 0;

    if (this.props.proj.projects && this.props.proj.projects.length > 0) {
      projlen = this.props.proj.projects.length;
    }
    if (this.props.proj.__typename === "ProjectGroup" && this.props.end == 1) { __typename = 'projects' }
    else if (this.props.proj.__typename === "ProjectGroup") { __typename = 'projectgroup' }
    else if (this.props.proj.__typename === "Project") { __typename = 'project' }
    else { return false }

    return (
      <Query query={GCOL_BID} variables={{ pid: this.props.proj.id }}>
        {({ loading, error, data, refetch }) => {
          if (loading) return "Loading...";
          if (error) {
            console.warn(error.message);
            //return(<div className="errorMessage">`Error! in C`</div>);
          }

          // let hmcols = data.columns.length;
          // let hmtasks = (data)=>{
          //   let col = 0;
          //   data.forEach((el, i, arr) => {
          //       col += el.tasks.length;   
          //   });
          //   return col;
          // }

          return (
            <div className="card">
              <Link className="no-underline ma1" to={`/${__typename}/${this.props.proj.id}`} type={this.props.proj.__typename} end={this.props.end}>
                <h2 className="card-name">{this.props.proj.title}{this.props.proj.name}</h2>
                <p className="card-id small">id {this.props.proj.id}</p>
              </Link>
              {/* {console.warn(projlen)} */}
              {projlen ? (<div className="projs">Проектов <span>{projlen}</span></div>) : ""}

              <div className="semafor">

                {/* <span className="y">2</span>
              <span className="g">5</span>
              <span className="r">1</span> */}
              </div>

              <svg className="add-favorite hover" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z" />
                <path fill="none" d="M0 0h18v18H0z" />
              </svg>
              <div className="delete open hover" onClick={() => { this.delete() }}>удалить</div>
            </div>

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