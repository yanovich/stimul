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
                <input
                  ref={node => {
                    input1 = node;
                  }}
                  placeholder="Описание"
                />
                <button type="submit">Добавить проект</button>
              </form>
            </div>
          )}
        </Mutation>
      );
    }else{
      return(
        <div className="card add" onClick={this.clickEvent}>                  
        <div>
          <svg className="plus" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
        </div>
      </div>
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