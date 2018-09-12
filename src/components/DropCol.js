import React, { Component, Fragment } from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";


export default class CreateCol extends Component {

  constructor(props) {
    super(props);
    this.state = {
      status: false,
      update: false,
    };

  }

  render(){
    let input0, input1, input2;
    let projectId = this.props.projectId;
      return (
        <Mutation
        mutation={DROP_COL_MUT}
        variables={this.props.columnId}
        >
          {(deleteColumnById, { data }) => (
                <div onClick={e => {
    if(!this.props.columnId){
      e.preventDefault();
     return false;
    }
    e.preventDefault();


    let upd = async () =>{
      await deleteColumnById({ variables: { id: this.props.columnId } });
      await this.props.refetch();
    }
    upd()
    this.setState({update: !this.state.update});
    this.props.update();
    this.props.refetch();
    
  }} className="btn small">удалить колонку</div>
          )}
        </Mutation>
      );
  }
  
};


const DROP_COL_MUT = gql`
  mutation DropCol($id: Int!) {
    deleteColumnById(columnId: $id)
  }
`;
