import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import PropTypes from 'prop-types';

export default class Draft extends Component {
  render() {
    // let title = "";
    let __typename = "projectgroup";

    if (this.props.proj.__typename === "ProjectGroup" && this.props.end === 1) { __typename = 'projects' }
    else if (this.props.proj.__typename === "ProjectGroup") { __typename = 'projectgroup' }
    else if (this.props.proj.__typename === "Project") { __typename = 'project' }
    else { return false }

    return (
      <Query query={GCOL_BID} variables={{ pid: this.props.proj.id }}>
        {({ loading, error, data, refetch }) => {
          if (loading) return "Loading...";
          if (error) return (<div className="errorMessage">`Error! ${error.message}`</div>);
          let hmcols = data.columns.length;
          let hmtasks = (data) => {
            let col = 0;

            data.forEach((el, i, arr) => {
              col += el.tasks.length;
            });

            return col;
          }
          let shct = false;
          
          if (this.props.proj.__typename === "Project") {
            shct = true;
          }

          return (
            <Link className="card no-underline ma1" to={`/${__typename}/${this.props.proj.id}`} type={this.props.proj.__typename} end={this.props.end}>
              <h2 className="card-name f3 black-80 fw4 lh-solid">{this.props.proj.title}{this.props.proj.name}</h2>
              <p className="card-id black-80 fw3">id {this.props.proj.id}</p>
              {shct ? (<Fragment><div>Колонок {hmcols}</div><div>Задач {hmtasks(data.columns)}</div></Fragment>) : ''}

              <div className="semafor">
                <span className="y">2</span>
                <span className="g">5</span>
                <span className="r">1</span>
              </div>
              <svg className="add-favorite" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z" />
                <path fill="none" d="M0 0h18v18H0z" />
              </svg>
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

Draft.propTypes = {
  end: PropTypes.number.isRequired,
  proj: PropTypes.any.isRequired
};