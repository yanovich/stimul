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
  constructor(props) {
    super(props)
    this.state = {
        priority: [],
    };
}

  componentDidMount(){

  }

  render() {
    const name = this.props.name;
    const description = this.props.description;
    const index = this.props.index;
    const id = this.props.id;
    const colId = this.colId;
    const i = this.i;
    const full = this.props.full[7];
    const priority = this.props.full[7].priority;
    const priorityname = this.props.priorityname;

      return (
        <Draggable draggableId={'row-'+colId+'|'+index} key={Number(colId+''+i)} index={index}>
          {provided => (
            <div data-priority={priority} className="task" key={'task'+index} ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            
            >
            
            <div className="taskHeader">
            <div className="taskName">{name}
            <svg className="add-favorite" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
            <path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z"/>
            <path fill="none" d="M0 0h18v18H0z"/>
            </svg>
            </div>
            {/* <div className="small">{cols.id+''+i}</div> */}
            {/* <div className="micro">id: {task.id}</div> */}
            </div>
            <div className="taskDescr">{description}</div>
            <div className="priority">{priorityname}</div>
            <div className="open small" onClick={()=>this.props.open(id)}>открыть</div>
            {provided.placeholder}
            </div>)}
        </Draggable>
      )
  }
}
