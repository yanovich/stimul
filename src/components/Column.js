import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { quf } from '../constants';
import { updTask, getPriority, getById, crTask } from '../graph/querys';
let filename = "file: Card";
let log = (fun, e) => {
  console.warn(filename, "func:", fun, e)
};

export default class Column extends Component {

  constructor(props) {
    super(props);
    this.state = {
      status: false,
      key: 0,
      opncr: false,
      open: false,
      input: [],
    };

    this._crTask = this._crTask.bind(this);
    this._opencr = this._opencr.bind(this);
    this._closecr = this._closecr.bind(this);
    this._input = this._input.bind(this);

  }

  _crTask() {


    
    let name = this.state.input[0];
    let description = this.state.input[1];
    let columnId = this.props.id;
    // let priority = this.state.input[3];
    // let createdBy = this.state.input[4];
    // name description columnId priority createdBy
    let input = `name: "${name}", description: "${description}", columnId: ${columnId}, priority: ${1}, createdBy: ${1}`;
    let q = crTask(`input: {${input}}`);

    console.log(q)
    quf(q)
      .then((a) => {
        console.warn(a)
      });
      this.props.refetch();
    this.setState({
      open: !this.state.open,
      input: [],
    })
  }

  _mutTask(id, input) {
    let q = updTask(id, `input: {${input}}`);

    console.warn(q)
    quf(q)
      .then((a) => {
        console.warn(a)
      });
  }
  
  _input(e){
    let inp = this.state.input;
    let val = e.target.value;
    let num = Number(e.target.name);

    inp[num] = val;

    this.setState({
      input: inp,
    })
  }

  _opencr(){

    this.setState({
      open: !this.state.open,
    })
  }

  _closecr(){
    this.setState({
      open: !this.state.open,
    })
  }


  _qPriority() {
    quf(getPriority)
      .then((a) => {
        if (a.data) {
          this.setState({
            priority: a.data.glossary.priorities
          })

          return a.data.glossary.priorities;
        } else {
          return false;
        }
      })
      .catch((e) => {
        log("getPriority", e);
      });
  }

  componentWillMount() {
    let id = this.props.id;
    let q = getById(id);

    quf(q)
      .then((a) => {
        if (a.data) {
          console.warn("a log", a)
          this.setState({
            id: this.props.id,
            task: a.data.task,
            dataGet: true,
            selectNewState: a.data.task.columnId,
            prior: a.data.task.priority,
          })
        } else {
          return false;
        }
      })
      .catch((e) => {
        log("getById", e);
      });
    this._qPriority();
  }


  editName() {
    this.setState({
      editName: true,
    })
  }

  changeName(e) {
    let val = e.target.value;

    this.setState(prevState => ({
      task: {
        ...prevState.task,
        name: val
      }
    }))
  }

  changeDescription(e) {
    let val = e.target.value;

    this.setState(prevState => ({
      task: {
        ...prevState.task,
        description: val
      }
    }))
  }




  render(){
    return(
      <div className="column">
        <div className="column-name">{this.props.name ? this.props.name : this.props.title }</div>
        <div className="column-id">id: {this.props.id}</div>
        <div className="column-content">
          <div className="column-inner">
            {
              this.props.full.tasks.map((e,i,a)=>{
                return(
                  <div className="task">
                    <div className="task-name">{e.name}</div>
                    <div className="task-description">{e.description}</div>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="column-bottom">
          {
            this.state.open ? (
              <div className="create-row">
                <div><input type="text" name="0" placeholder="Название" value={this.state.input[0]} onChange={this._input}/></div>
                <div><input type="text" name="1" placeholder="" value={this.state.input[1]} onChange={this._input}/></div>
                <div className="open" onClick={this._crTask}>Создать задачу</div>
                <div className="open" onClick={this._closecr}>отменить</div>
              </div>
            ) : (<div className="open" onClick={this._opencr}>Добавить задачу</div>)
          }
          
        </div>


        <svg className="add-fav hov" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
          <path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z" />
          <path fill="none" d="M0 0h18v18H0z" />
        </svg>
        <div className="open del hov">удалить</div>
      </div>
    );
  }
}


Column.propTypes = {
  name: PropTypes.string,
  id: PropTypes.number,
  full: PropTypes.object,
};
