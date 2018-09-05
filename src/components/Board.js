import React, { Fragment } from 'react';
import {CreateTask} from './CreateTask';
import CreateCol from './CreateCol';
import gql from "graphql-tag";
import { Query } from "react-apollo";




class Board extends React.Component{
    constructor(props) {
        super(props)
        this._parentUp = this._parentUp.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.state = {
            update: false,
            key: 0,
        };
    }

    _parentUp = ()=>{
        this.forceUpdate();
    }
    forceUpdateHandler(){
        this.forceUpdate();
    };
    render(){
        let pid = this.props.match.params.id || 1;
        console.log(this.props);
        //let pid = this.props.pid.pid || 1;
        //let pid = this.props.match.params.id || 1;
        return(
            <Fragment>
            <Query query={GCOL_BID} variables={{pid: pid}}>
            {({ loading, error, data, refetch }) => {
              if (loading) return "Loading...";
              if (error) return `Error! ${error.message}`;
              let howmcols = data.columns.length;
                return (
                    <div className="lists">
                        {  data.columns.map((cols, i, arr) => {
                            return(
                                <div className="column" key={i} order={cols.order}>
                                <div className="colHeader">
                                    <div className="colName">{cols.name}</div>
                                    <div className="small">id: {cols.id}</div>
                                </div>
                                        {
                                            cols.tasks.map((task, i, arr)=>{
                                                return(
                                                <div className="task" key={'task'+i}>
                                                <div className="taskHeader">
                                                    <div className="taskName">{task.name}</div>
                                                    <div className="small">{task.id}</div>
                                                </div>
                                                    <div className="taskDescr">{task.description}</div>
                                                </div>
                                                )

                                            })
                                        }

                                        <CreateTask columnId={cols.id} update={this._parentUp} refetch={() => refetch()}/>

                                </div>
                        
                        )
                        }
                    )}
                    <CreateCol projectId={pid} update={this._parentUp} refetch={() => refetch()} />
                    </div>
                  )
            }}
            
          </Query>
          </Fragment>
        )
    }

}


export default Board;

const GTSK_BID = gql`
query getTasks($id: Int!) {
    tasks(columnId: $id) {
      id
      name
      description
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