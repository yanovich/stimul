import React, { Component, Fragment } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  NavLink,
  Link,
  Redirect,
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';


export default class Task extends Component {
  render() {
    const name = this.props.name;
    const description = this.props.description;
    const index = this.props.index;
    const id = this.props.id;
    const colId = this.colId;
    const i = this.i;

      return (
        <Draggable draggableId={'row-'+colId+'|'+index} key={Number(colId+''+i)} index={index}>
          {provided => (
            <div className="task" key={'task'+index} ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
            >
            <div className="taskHeader">
            <div className="taskName">{name}</div>
            {/* <div className="small">{cols.id+''+i}</div> */}
            {/* <div className="micro">id: {task.id}</div> */}
            </div>
            <div className="taskDescr">{description}</div>
            <div className="open small" onClick={()=>this.props.open(id)}>открыть</div>
            {provided.placeholder}
            </div>)}
        </Draggable>
      )
  }
}
