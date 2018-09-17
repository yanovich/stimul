import React, { Component, Fragment } from 'react';
import Proj from '../components/Proj';
//import Drafts from '../components/Drafts';
import { Query } from 'react-apollo';
import  { gql } from 'apollo-boost';
import AddGroup from './AddGroup';

export default class GetDraftsGr extends Component {
  render() {
    let pid = this.props.match.params.id || 1;
    return(
        <Query query={GET_BYPID} variables={{pid: pid}}>
        {({ loading, error, data, refetch }) => {
          if (loading) return "Loading...";
          if (error){
            console.log(error.message);
            //return(<div className="errorMessage">`Error! in C`</div>);
          }
          console.log(data)
            return (
                <Fragment>
                  { data.projectGroups.map(proj => {
                      
                      let end = 0;
                        if(proj.projects && proj.projects.length > 0){
                          end = 1;
                          return(
                            <Proj
                              key={proj.id}
                              proj={proj}
                              type={proj.__typename}
                              end={end}
                            />
                          )
                        }else{
                          return(
                            <Proj
                              key={proj.id}
                              proj={proj}
                              type={proj.__typename}
                              end={end}
                            />
                          )
                        }

                    }
                )}
                <AddGroup pid={this.props.match.params.id} refresh={() => refetch()} />
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