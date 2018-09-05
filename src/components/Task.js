import React, { Component, Fragment } from 'react';

export class Task extends Component {
  render() {
      return (
        <div className="task" >
           <div>{this.props.name}</div>
           <div>{this.props.id}</div>
           <div>{this.props.description}</div>
        </div>
      )
  }
}
