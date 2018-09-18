import React, { Component, Fragment } from 'react';
import Proj from '../components/Proj';
//import Drafts from '../components/Drafts';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

export class GetOth extends Component {
  render() {
    return (
      <Query
        query={this.props.query}
        variables={{ pid: this.props.pid }}
      >
        {({ loading, data }) => {
          if (loading) return <span>loading....</span>
          return (
            <Fragment>
              {data.projects.map(proj => (
                <Proj
                  key={proj.id}
                  proj={proj}
                  type="ProjectGroup"
                  end="0"
                />
              )
              )}
            </Fragment>
          )
        }}
      </Query>
    )
  }


};

export default class GetById extends Component {
  render() {
    let pid = this.props.match.params.id || 1;
    return (
      <Query query={GET_BYPID} variables={{ pid: pid }}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
          if (data.projectGroups) {
            return (
              <Fragment>
                {data.projectGroups.map(proj => {
                  let end = 0;
                  if (proj.projects && proj.projects.length > 0) { end = 1; }
                  return (
                    <Proj
                      key={proj.id}
                      proj={proj}
                      type="ProjectGroup"
                      end={end}
                    />
                  )
                }
                )}
              </Fragment>
            )
          } else if (data.projectGroups.projects) {
            return (
              <GetOth pid={pid} query={GETDR_BYPID} />
              // <Fragment>
              //   { data.projectGroups.projects.map(proj => (
              //         <Proj
              //           key={proj.id}
              //           proj={proj}
              //           type="Projects"
              //           end="1"
              //         />
              //   )
              // )}
              // </Fragment>
            )
          } else {
            return (<div>пусто</div>)
          }

        }}
      </Query>
    )
  }
}

export const GET_BYPID = gql`
  query getByPid($pid: Int!) {
    projectGroups(parentId: $pid) {
    id
    name
    parentId
    projectGroups{
        id
        name
        parentId
        projects{
            id
            title
        }
    }
    projects{
            id
            title
            parentId
        }
    }
  }
`

export const GETDR_BYPID = gql`
  query getByPid($pid: Int!) {
    projects(parentId: $pid) {
            id
            title
            parentId
    }
  }
`