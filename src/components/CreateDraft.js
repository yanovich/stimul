import React, { Component, Fragment } from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

export default class CreateCol extends Component {

  constructor(props) {
    super(props);
    this.state = {
      status: false,
      key: 0
    };

  }

  clickEvent = () => {
    this.setState({status: true});
  }

  render(){
    let input0, input1, input2;
    let parentId = this.props.pid;
    let op = this.state.status;

    if(op){
      return (
        <Mutation
        mutation={CREATE_DRAFT_MUTATION}

        >
          {(createProject, { data }) => (
            <div className="card">
              <form
                onSubmit={e => {
                  if(!input0.value){
                    e.preventDefault();
                   return false;
                  }
                  e.preventDefault();
                  
                  let upd = async () =>{
                    await createProject({ variables: { title: input0.value, parentId: parentId.pid } });
                    await this.props.refetch();
                  }
                  upd()
                  input0.value = "";
                }}
              >
                <input
                  ref={node => {
                    input0 = node;
                  }}
                  placeholder="Наименование"
                />
                <button type="submit">Добавить проект</button>
              </form>
            </div>
          )}
        </Mutation>
      );
    }else{
      return(
        <button onClick={this.clickEvent} className="column-create">Создать новый</button>
      )
    }

  }
  
};

const CREATE_DRAFT_MUTATION = gql`
  mutation CreateDraftMutation($title: String!, $parentId: Int!, $description: String) {
    createProject(title: $title, description: $description, createdBy: 1, teamId: 1, parentId: $parentId) {
      id
      title
      description
    }
  }
`;