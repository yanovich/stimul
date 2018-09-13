import React, { Component, Fragment } from 'react';
import {url} from '../constants';
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

const getById = `
query getById($id: String!) {
    task(id: $id) {
        id
        name
        description
        index
        columnId
        priority
      }
}
`;


const getPriority = `{
    glossary{
        priorities{
          name
          id
        }
      }
    }
`;

/*
check on backend

if ColumnIdOld->ProjectIdSame != ColumnIdNew->ProjectIdSame then FuckU
*/

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
      
};

const quer2 = (query) =>{
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
};

const query2 =(...params)=>{
    return(`mutation{
        updateTask(id: "${params[0]}", ${params[1]})
      }`)
}

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
        };
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
        let q = query2(id,`input: {${input}}`);
        console.log(q)
        quer2(q)
        .then((a)=>{
            console.log(a)
        });
    }


    _qPriority(){
        quer(getPriority)
        .then((a)=>{
            if(a.data){
                this.setState({
                    priority: a.data.glossary.priorities
                })
                return a.data.glossary.priorities;
            }else{
                return true;
            }

        });
    }


    componentWillMount(){
        const id = this.props.opid;
            quer(getById, { id: id } )
            .then((a)=>{
                console.log("a log",a)
                this.setState({
                    id: this.props.opid,
                    task: a.data.task,
                    dataGet: true,
                    selectNewState: a.data.task.columnId,
                    prior: a.data.task.priority,
                })
            });
            this._qPriority();
    }


  render() {
      let data = this.state.task;
      let cols = this.props.cols;
      let prior = this.state.priority;
      
      console.log(data)
    if(this.state.dataGet){
        return (
            <div className="taskModule">
            <div className="content">
            <div className="scroller">
                <div className="inner">
                <div className="">Задача: <h1>{data.name}</h1></div>
                <div className="description"><span className="left-titles">Описание</span><span>{data.description}</span></div>
                <div className="id"><span className="left-titles">ID</span><span>{data.id}</span></div>
                <div className="status">
                <span className="left-titles">Состояние</span> 
                <select value={this.state.selectNewState} name="columnId" onChange={this.selNewState.bind(this)}>
                    {
                        cols.map((col, i , arr)=>{
                            return(<option key={i} value={col.id}>{col.name}</option>)
                        })
                    }
                </select>

                </div>
                <div className="status">
                <span className="left-titles">Важность</span> 
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
                    <h3 className="">Ответственные:</h3>
                    <div className="text">
                        <ul>
                            <li>Ответственный И.А.</li>
                            <li>Ответственов В.Ю.</li>
                            <li>Отвечаев С.Р.</li>

                        </ul>
                        <div className="svgOuter">
                            
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>

                        </div>
                    </div>
                    </div>
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
