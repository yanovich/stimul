import React, { Component } from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";


export class CreateTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: "",
      status: false,
      update: false,
    };
  }

  clickEvent = () => {
    this.setState({ status: true });
    this.props.update();
  }
  clickOut = () => {
    this.setState({ status: false });
    //this.props.update();
  }

  render() {
    let a = this.state.status;
    let up = this.state.update;
    let input0, input1, input2;
    let columnId = this.props.columnId;

    if (!a) {
      return (
        <button className="button" onClick={this.clickEvent}>Добавить задачу</button>

      )
    } else {

      return (
        <Mutation
          mutation={CREATE_TASK_MUT}
        >
          {(createTask, { data }) => (
            <div className="task create">
              <form
                onSubmit={e => {
                  if (!input0.value) {
                    e.preventDefault();

                    return false;
                  }
                  e.preventDefault();


                  let upd = async () => {
                    await createTask({ variables: { name: input0.value, description: input1.value, columnId: columnId } });
                    // await this.props.refetch();
                  }

                  upd()
                  input0.value = "";
                  input1.value = "";

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
                <input
                  ref={node => {
                    input1 = node;
                  }}
                  placeholder="Описание"
                />

                <button type="submit">Добавить задачу</button>
                <div className="btn" onClick={this.clickOut}>отмена</div>
              </form>
            </div>
          )}
        </Mutation>
      );
    }
  }

};


const CREATE_TASK_MUT = gql`
  mutation CreateTask($name: String!, $columnId: Int!, $description: String!) {
    createTask(name: $name, columnId: $columnId, description: $description, createdBy: 1) {
        id
        name
        columnId
        description
    }
  }
`;

