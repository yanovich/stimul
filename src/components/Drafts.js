import React, { Component, Fragment } from 'react';
import Draft from '../components/Draft';
import CreateDraft from '../components/CreateDraft';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
//import { Link } from 'react-router-dom';

export default class GetDrafts extends Component {
  constructor(props) {
    super(props)
    this._parentUp = this._parentUp.bind(this);
    this.state = {
      update: false,
      key: 0,
    };
  }
  _parentUp = () => {
    this.forceUpdate();
  }
  render() {
    let pid = this.props.match.params.id || 1;

    return (
      <Fragment>
        <Query query={GETDR_BYPID} variables={{ pid: pid }}>
          {({ loading, error, data, refetch }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            return (
              <Fragment>
                {data.projects.map(proj => {
                  let end = 1;
                  
                  return (
                    <Draft
                      key={proj.id}
                      proj={proj}
                      type={proj.__typename}
                      end={end}
                    />
                  )
                }
                )}
                <CreateDraft {...this.props} pid={{ pid: pid }} refetch={() => refetch()} update={this._parentUp} />
              </Fragment>
            )
          }}
        </Query>

      </Fragment>
    )
  }
}


export const GETDR_BYPID = gql`
  query getByPid($pid: Int!) {
    projects(parentId: $pid) {
            id
            title
            parentId
    }
  }
`;
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