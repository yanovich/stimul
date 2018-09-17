import React, { Component, Fragment } from 'react';
import {url, quf} from '../constants';
import {updTask, getPriority, getById} from '../graph/querys';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import gql from "graphql-tag";
import {
    NavLink,
    Link,
    Redirect,
    BrowserRouter as Router,
    Route,
    Switch,
  } from 'react-router-dom';


let filename = "file: Card";
let log =(fun, e)=>{
    console.log(filename,"func:",fun,e)
};

/*
check on backend

if ColumnIdOld->ProjectIdSame != ColumnIdNew->ProjectIdSame then FuckU
*/




const _DB = {
    priority: []
}

export default class Card extends Component{
    constructor(props) {
        super(props)
        this.state = {
            id: "",
            task: {},
            dataGet: false,
            selectNewState: 0,
            priority: [],
            prior: 0,
            descr: {},
            card:{},
            edit: false,
            editName: false,
        };
        this.editName = this.editName.bind(this);
    }
    selNewState(event){
        if(event.target.name && event.target.name === "columnId"){
            this.setState({
                selectNewState: event.target.value
            });
        }else if(event.target.name && event.target.name === "priority"){
            this.setState({
                prior: event.target.value
            });
            
        }else if(event.target.name && event.target.name === "description"){

        }else{}
        console.log(event.target.value)
        let val = event.target.value;
        console.log(typeof(event.target.value) );
        console.log(typeof(val) );
        let id = this.state.id;
        if(event.target.value === "description"){
            //val = `"${event.target.value}"`;
            
            this._mutTask(id, `${event.target.name}: "${val}"`)
        }else{
            this._mutTask(id, `${event.target.name}: ${event.target.value}`)
        }
    }

    // setNewDescr(event){
    //     this.setState({
    //         task: event.target.value
    //     });

    //     let id = this.state.id;
    //     this._mutTask(id, `description: ${event.target.value}`)
    // }

    _mutTask(id, input){
        let q = updTask(id,`input: {${input}}`);
        console.log(q)
        quf(q)
        .then((a)=>{
            console.log(a)
        });
    }


    _qPriority(){
        quf(getPriority)
        .then((a)=>{
            if(a.data){
                this.setState({
                    priority: a.data.glossary.priorities
                })
                return a.data.glossary.priorities;
            }else{
                return false;
            }
        })
        .catch((e)=>{
            log("getPriority",e);
        });
    }

    componentWillMount(){
        let id = this.props.opid;
        let q = getById(id);
            quf(q)
            .then((a)=>{
                if(a.data){
                console.log("a log",a)
                this.setState({
                    id: this.props.opid,
                    task: a.data.task,
                    dataGet: true,
                    selectNewState: a.data.task.columnId,
                    prior: a.data.task.priority,
                })
            }else{
                return false;
            }
            })
            .catch((e)=>{
                log("getById",e);
            });
            this._qPriority();
    }


    editName(){
        this.setState({
            editName: true,
        })
    }
    changeName(e){
        let val = e.target.value;
        this.setState(prevState => ({
            task: {
                ...prevState.task,
                name: val
            }
        }))
    }

    // changeA(e){
    //     let val = e.target.value;
    //     let task = Object.assign({}, this.state.task);
    //     task.name = 'new';                        
    //     this.setState({task});
    // }

    changeDescription(e){
        let val = e.target.value;
        this.setState(prevState => ({
            task: {
                ...prevState.task,
                description: val
            }
        }))
    }

  render() {
      let data = this.state.task;
      let cols = this.props.cols;
      let prior = this.state.priority;
      let edit = this.state.edit;
      let editName = this.state.editName;
      let users = [
        {name: "Пользователь О.Д." , id: 1},
        {name: "Пользователь Д.В." , id: 2},
      ];
      
      console.log(data)
    if(this.state.dataGet){
        return (
            <div className="taskModule">
            <div className="content">
            <div className="scroller">
                <div className="inner">
                <div className="task-name" onClick={this.editName}>Задача: {editName ? ( <input type="text" value={this.state.task.name} palceholder="Введите название"/> ) : (<h3>{data.name}</h3>) }</div>
                <div className="description in-block"><span className="left-titles">Описание:</span><div>{data.description}</div></div>
                <div className="id small"><span className="left-titles">ID:</span><span>{data.id}</span></div>
                <div className="status in-block">
                <span className="left-titles">Состояние:</span> 
                <select value={this.state.selectNewState} name="columnId" onChange={this.selNewState.bind(this)}>
                    {
                        cols.map((col, i , arr)=>{
                            return(<option key={i} value={col.id}>{col.name}</option>)
                        })
                    }
                </select>

                </div>
                <div className="status in-block">
                <span className="left-titles">Важность:</span> 
                <select value={this.state.prior} name="priority" onChange={this.selNewState.bind(this)}>
                    {
                        prior.map((pri, i , arr)=>{
                            return(<option key={i} value={pri.id}>{pri.name}</option>)
                        })
                    }
                </select>
                </div>
                
                </div>
                <div className="inner">
                    <input type="text" placeholder="" value=""/>
                    <textarea></textarea>
                </div>
                
                <div className="inner">
                    <div className="group">
                    <h3 className="">Исполнители:</h3>
                    <div className="text">
                        <div className="users-list">
                            {
                                users.map((el,i,arr)=>{
                                    return(
                                        <div className="user-el" data-id={el.id}>
                                        <span className="user-name">{el.name}</span>
                                        <span className="user-svg">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                <path d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
                                            </svg>
                                        </span>
                                        </div>
                                        )
                                })
                            }
                            <svg className="svg-add" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                    </div>
                    <h3 className="">Ответственные:</h3>
                    <div className="text">
                        <div className="users-list">
                            {
                                users.map((el,i,arr)=>{
                                    return(
                                        <div className="user-el" data-id={el.id}>
                                        <span className="user-name">{el.name}</span>
                                        <span className="user-svg">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                <path d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
                                            </svg>
                                        </span>
                                        </div>
                                        )
                                })
                            }
                            <svg className="svg-add" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="inner">
                    <div className="comments">
                            <div className="inn">
                                <div className="scroller">

                                </div>
                            </div>
                    </div>
                    <textarea></textarea>
                </div>
    
            </div>
            <div className="bottom">
            <div className="btn" onClick={()=>{this.props.close()}}>
                закрыть
            </div>
            </div>
            </div>
        </div>
        ); 
    }else{
        return(
            <div className="loader">Загрузка..</div>
        )
    }

  }
}
