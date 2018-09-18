import React, { Component } from 'react';
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

  clickEvent = () => {
    this.setState({ status: !this.state.status });
    this.props.update();
  }

  render() {
    let input0, input1, input2;
    let projectId = this.props.projectId;
    let op = this.state.status;

    if (op) {
      return (
        <Mutation
          mutation={CREATE_COL_MUT}
        >
          {(createColumn, { data }) => (
            <div className="column">
              <form
                onSubmit={e => {
                  if (!input0.value) {
                    e.preventDefault();

                    return false;
                  }
                  e.preventDefault();


                  let upd = async () => {
                    await createColumn({ variables: { name: input0.value, order: 1, projectId: projectId } });
                    // await this.props.refetch();
                  }
                  
                  upd()
                  input0.value = "";

                  this.props.update();
                  // this.props.refetch();
                  this.setState({ update: !this.state.update, status: false });
                }}
              >
                <input
                  ref={node => {
                    input0 = node;
                  }}
                  placeholder="Наименование"
                />
                <button type="submit">Создать список</button>
              </form>
            </div>
          )}
        </Mutation>
      );
    } else {
      return (
        <div onClick={this.clickEvent} className="button">Добавить список задач</div>
      )
    }

  }

};


const CREATE_COL_MUT = gql`
  mutation CreateCol($name: String!, $projectId: Int!, $order: Int!) {
    createColumn(name: $name, projectId: $projectId, order: $order) {
        id
        name
        order
    }
  }
`;
