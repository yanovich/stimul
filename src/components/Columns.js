import React, { Component } from 'react';
import {CreateTask} from './CreateTask';
import {Task} from './Task';
import gql from "graphql-tag";
import { Query } from "react-apollo";

export default class Column extends Component {
  constructor(props) {
    super(props)
    this.handler = this.handler.bind(this);
    this.state = {
        update: false
    };
}
handler() {
    this.setState({
      update: true
    });
}

  render() {
        console.log('col props',this.props);
        if(!this.state.update){
          return (
            <div className="column" >
                {this.props.name}
                
                <div className="small">id: {this.props.id}</div>
                    { this.props.data.tasks.map((task, i, arr) => {
                            return(
                              <Task key={i} name={task.name} description={task.description} id={task.id} />
                          )
                        }
                    )}
    
                <CreateTask action={this.handler} columnId={this.props.id} />
            </div>
          )
        }else{
          return (
            <Query query={GETTASKS_BYCID} variables={{id: this.props.id}}>
            {({ loading, error, data }) => {
              if (loading) return "Загрузка...";
              if (error) return(<div className="errorMessage">`Error! ${error.message}`</div>);
        
              return (
                <div className="column" >
                {this.props.name}

                <div className="small">id: {this.props.id}</div>
                    { data.tasks.map((task, i, arr) => {
                            return(
                              <Task key={i} name={task.name} description={task.description} id={task.id} />
                          )
                        }
                    )}
    
                <CreateTask action={this.handler} columnId={this.props.id} />
            </div>
              );
            }}
          </Query>

          )
        }
  }
}
const GETTASKS_BYCID = gql`
query getTasks($id: Int!) {
    tasks(columnId: $id) {
      id
      name
      description
    }
  }
`;