import React, { Component, Fragment } from 'react';
import Proj from '../components/Proj';
//import Drafts from '../components/Drafts';
import { Query } from 'react-apollo';
import  { gql } from 'apollo-boost';

export default class GetDraftsGr extends Component {
  render() {
    let pid = this.props.match.params.id || 1;
    return(
        <Query query={GET_BYPID} variables={{pid: pid}}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
            return (
                <Fragment>
                  { data.projectGroups.map(proj => {
                      let end = 0;
                        if(proj.projects && proj.projects.length > 0){ end = 1;}
                        return(
                            <Proj
                              key={proj.id}
                              proj={proj}
                              type={proj.__typename}
                              end={end}
                            />
                      )
                    }
                )}
                </Fragment>
              )
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

export const DRAFTS_QUERY = gql`
  query draftsQuery {
    getAllProjects {
      id
      title
    }
  }
`