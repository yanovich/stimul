import React, { Component, Fragment } from 'react';
// import styled from 'react-emotion';
import {CreateTask} from './CreateTask';
import CreateCol from './CreateCol';
import DropCol from './DropCol';
import gql from "graphql-tag";
//import { Query } from "react-apollo";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import 'cross-fetch/polyfill';
//import { grid, colors, borderRadius } from '../constants';
import Card from './Card';
import Task from './Task';
import {url} from '../constants';
//import CardOpen from './CardOpne';


const publishOnDragStart = (result) => console.log('onDragStart',result);
const publishOnDragEnd = (result) => console.log('onDragEnd',result);


export const GCOL_BID = gql`
  query getByPid($pid: Int!) {
    columns(projectId: $pid){
      name
      order
      id
      project {
        id
      }
      tasks {
        id
      name
      columnId
      description
      index
      priority
      }
    }
  }
`;

const columns_getter = `
query getByPid($pid: Int!) {
  columns(projectId: $pid){
    name
    order
    id
    project {
      id
    }
    tasks {
      id
      name
      columnId
      description
      index
      priority
    }
  }
}
`

const quer = (query, vars) =>{
    return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query,
        variables: vars,
        })
      })
        .then(r => r.json())
        .then(data => data)
        .catch((e)=>{
            console.log('Cant get quer',e)
        });
        
};


let _LIST = {
    cols: {},
    cards: [],
    colm: [],
    task: [],
    tasks: {},
    pid: 1
};

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const move0 = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const removefa = (arr, index)=>{
    if (index > -1) {
        arr.splice(index, 1);
        return arr;
    }
}
const appendta = (arr, index, el)=>{
    if (index > -1) {
        arr.splice(index, 0, el);
        return arr;
    }
}

const newMove = (arr, from, to)=>{
arr.move(from,to);
return arr;
}
const array_move = (arr, old_index, new_index) => {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};

const getPriority = `{
    glossary{
        priorities{
          name
          id
        }
      }
    }
  `;
  const query = (query) =>{
    return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query
        })
      })
        .then(r => r.json())
        .then(data => data)
        .catch((e)=>{
            console.log('Cant get query',e)
        });
        
  };










export default class Board extends React.Component{
    constructor(props) {
        super(props)
        this._parentUp = this._parentUp.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.state = {
            open: false,
            openId: "",
            newquery: true,
            _task: [],
            _cols: [],
            pid: 1,
            priority: [],
        };
    }
    u = (refetch)=>{
        setInterval(()=>{
            refetch();
          }, 2000);
      }
    _addCols = (arr)=>{
        this.setState({
            cols: arr,
        })
    }
    _openTask = (data)=>{
        console.log(data)
        
        this.setState({
            openId: data,
            open: true,
        })
        console.log(this.state);
    }
    _closeCard = ()=>{
        //console.log(data)
        
        this.setState({
            openId: "",
            open: false,
            newquery: true,
            _task: []
        })
        this.updMe();
        
        console.log(this.state);
    }
    _addTasks = (arr)=>{
        this.setState({
            tasks: arr,
        })
    }
    _parentUp = ()=>{
        //this.forceUpdate();
    }
    forceUpdateHandler(){
        this.forceUpdate();
    };

    _setnewstate(list){
        this.setState({_LIST: list})
    }
    _setcols(cols){
        this.setState({_cols: cols})
    }
    onDragStart = (initial) => {
        publishOnDragStart(initial);
      };
    
    onDragEnd = (result) => {
        publishOnDragEnd(result);

        const { source, destination } = result;
 
        if (!destination) {
            return;
        }
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
          ) {
            return;
          }
        if (result.type === "TASK" && source.index !== destination.index) {

            return;
          }

        if (result.type === "COLUMN") {
            if (source.index !== destination.index) {

            }
            return;
          }

        if (source.droppableId === destination.droppableId) {
            console.log(source.index,source.droppableId, '=>', destination.droppableId, destination.index);
            const items = reorder(
                source.droppableId,
                source.index,
                destination.index
            );
            
            let state = { items };
            console.log('drag state', state );
            console.log( state );

         }
        // else {
        //     const result = move(
        //         source.droppableId,
        //         destination.droppableId,
        //         source,
        //         destination
        //     );
        // }
        
        // if(this.shouldComponentUpdate(this.props, {_cols: newState})){
        //     this.setState({
        //         _cols: newState
        //     })
        // }


    };
    _updPid(){
        let pid = this.props.match.params.id || 1;
        _LIST.pid = pid;
    }
    
    componentDidMount(){
        query(getPriority)
        .then((a)=>{
          if(a.data){
            this.setState({
                priority: a.data.glossary.priorities
            })
            return a.data.glossary.priorities;
            }else{
                return true;
            }
        }).catch((e)=>{
            console.log('Cant get getPriority',e)
        });
    }
    
    updMe(){
            let pid = this.props.match.params.id || 1;
            _LIST.pid = pid;            
            quer(columns_getter, { pid: pid } )
            .then((a)=>{
                // if(a.data){
                    _LIST.colm = [];
                    _LIST.cards = [];
                    _LIST.task = [];
                    this.setState({
                        _cols: [],
                        _task: [],
                        newquery:true,
                    })
                    return a;
                // }else{
                //     return false;
                // }
            })
            .then((a)=>{
                a.data.columns.map((cols, ci, arr)=>{
                    let o = 'col-'+cols.id+''+ci;

                    _LIST.colm.push({ iid: o , index: ci, name: cols.name, id: cols.id, order: cols.order, project: cols.project.id, tasks: cols.tasks})
                    _LIST.cards.push(cols.tasks)
                    cols.tasks.map((task, i, arr)=>{
                        _LIST.task.push(['col-'+cols.id+''+ci, Number(cols.id+''+i) , i,task.columnId, task.id, task.name, task.description, task, task.priority ])
                    })

                });
            }).then(()=>{
                _LIST.task.sort(
                    (a, b)=>{
                        if (a[8] > b[8]) {
                          return 1;
                        }
                        if (a[8] < b[8]) {
                          return -1;
                        }
                        return 0;
                      });

                // console.log(_LIST.task)
                this.setState({
                    pid: pid,
                    _cols: _LIST.colm,
                    _task: _LIST.task,
                    newquery:false,
                })
            })
            .catch((e)=>{
                console.log('Cant get columns_getter',e)
            });

    }

    componentWillMount(){
        
        if(this.state.newquery){
            this.updMe()
        }else{
            return;
        }
    }
    componentWillUpdate(){

    }


    render(){
            let data = this.state._cols;
            let tasks = this.state._task;

            if(this.state.open && this.state.openId){
               return(<Card opid={this.state.openId} close={this._closeCard} cols={data} />) 
            }else{
            return(
                <Fragment>
                        <div className="lists">
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            {  data.map((cols, i, arr) => {

                                return(
                                    <div className="column" key={i} order={cols.order}>
                                    <div className="colHeader">
                                        <div className="colName">{cols.name}</div>
                                        {/* <div className="small">{i}</div> */}
                                        {/* <div className="small">id: {cols.id}</div> */}
                                    </div>
                                        <div className="column-content1" >
                                        <Droppable droppableId={cols.iid+'|'+i} type="TASK" key={'drop'+i} direction="vertical">
                                            { provided => (
                                        <div className="inner" ref={provided.innerRef} {...provided.droppableProps} >
                                        {
                                                tasks.map((task, i, arr)=>{
                                                    let priorityname = "";
                                                    if(task[0] === cols.iid){
                                                        if(task[7].priority){
                                                            this.state.priority.map((a,b,c)=>{
                                                                if(a.id === task[7].priority){
                                                                    priorityname = a.name;
                                                                    return priorityname;
                                                                }
                                                            })

                                                        }
                                                        return(
                                                                <Task key={i} index={task[0]+''+i} name={task[5]} description={task[6]} id={task[4]} open={this._openTask} full={task} colId={ cols.id } priorityname={priorityname} i={1}/>
                                                            )
                                                    }
                                                })
                                                }
                                                {provided.placeholder}
                                                </div>
                                                    )}
                                                    </Droppable>
                                                </div>

                                            <CreateTask columnId={cols.id} update={this._parentUp} />
                                            <DropCol columnId={cols.id} update={this._parentUp} />
                                    </div>
                            
                            )
                            }
                        )}
                        </DragDropContext>
                        <CreateCol projectId={this.state.pid} update={this._parentUp} />
                        </div>
              </Fragment>
            )
        }
    }
}