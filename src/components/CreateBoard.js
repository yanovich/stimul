import React, { Component } from 'react';
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
    this.setState({ status: true });
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
            <div className="column-create">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  createColumn({ variables: { name: input0.value, order: 1, projectId: projectId } });
                  input0.value = "";
                }}
              >
                <input
                  ref={node => {
                    input0 = node;
                  }}
                  placeholder="Наименование"
                />
                <button type="submit">Добавить колонку</button>
              </form>
            </div>
          )}
        </Mutation>
      );
    } else {
      return (
        <button onClick={this.clickEvent} className="column-create">добавить новую колонку</button>
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
