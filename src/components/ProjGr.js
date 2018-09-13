import React, { Component, Fragment } from 'react'
import Proj from '../components/Proj'
import { Query } from 'react-apollo'
import  { gql } from 'apollo-boost'
import AddGroup from './AddGroup'

export default class DraftsPage extends Component {
  render() {
    return (
      <Query query={ALLGR_QUERY} variables={{pid: 1}}>
        {({ data, loading, error, refetch }) => {
          if (loading) {
            return (
              <div className="flex w-100 h-100 items-center justify-center pt7 flex-container">
                <div>Загрузка ...</div>
              </div>
            )
          }

          if (error) {
            return (
              <div className="flex w-100 h-100 items-center justify-center pt7 flex-container">
                <div>Раздел в разработке</div>
              </div>
            )
          }
          return (
            <Fragment>
              {data.projectGroups &&
                data.projectGroups.map(proj => (
                  <Proj
                    key={proj.id}
                    proj={proj}
                    refresh={() => refetch()}
                  />
                ))}
              {data.getAllProjects &&
                data.getAllProjects.map(proj => (
                  <Proj
                    key={proj.id}
                    proj={proj}
                    refresh={() => refetch()}
                  />
                ))}
              {data.projects &&
                data.projects.map(proj => (
                  <Proj
                    key={proj.id}
                    proj={proj}
                    refresh={() => refetch()}
                  />
                ))}
              {this.props.children}
              <AddGroup />
            </Fragment>
          )
        }}
        
      </Query>
    )
  }
}

export const DRAFTS_QUERY = gql`
  query draftsQuery {
    getAllProjects {
      id
      title
    }
  }
`

export const ALLGR_QUERY = gql`
  query ProjectGroups($pid: Int!) {
    projectGroups(parentId: $pid) {
    id
    name
    parentId
    projectGroups{
        id
        name
        parentId

    }
    projects{
            id
            title
            parentId
        }
  }
  }
`;
