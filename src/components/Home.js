import React, { Component, Fragment } from 'react'
import Proj from '../components/Proj'
import { Query } from 'react-apollo'
import  { gql } from 'apollo-boost'

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
                data.projectGroups.map(proj => {
                  if(data.projects && data.projects.length > 0){
                    return (
                      <Proj
                        key={proj.id}
                        proj={proj}
                        refresh={() => refetch()}
                        type="ProjectGroup"
                        end="1"
                      />
                    )
                  }
                  else{
                    return(
                      <Proj
                        key={proj.id}
                        proj={proj}
                        refresh={() => refetch()}
                        type="ProjectGroup"
                        end="0"
                      />
                    )}
                  }

                )}
              {this.props.children}
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
`
