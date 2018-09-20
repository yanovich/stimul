import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { quf } from '../constants';


const crPrGr = (parentId, name, createdBy) => (
  `mutation{
            createProjectGroup(name: "${name}", parentId: ${parentId}, createdBy: ${createdBy}){
                id
                name
            }
        }`
);

const crPrj = (title, name, description, createdBy, parentId) => (
  `mutation{
           createProject(name: "${name}", title: "${title}", description: "${description}", parentId: ${parentId}, createdBy: ${createdBy}){
                id
                name
            }
        }`
);


export default class CrTile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      key: 0,
      input: [],
      chk: false,
    };

    this._create = this._create.bind(this);
    this._open = this._open.bind(this);
    this._input = this._input.bind(this);
    this.chkbx = this.chkbx.bind(this);
  }
  

  _create(){
    let crt = '', name='', title='', description='', createdBy = 1;
    let pid = Number(this.props.pid);

    name = this.state.input[0];
    title = this.state.input[0];

    if(this.state.chk){
      description = this.state.input[1] || 'Нет описания';
      crt = crPrj(title, name, description, createdBy, pid);
    }else{
      crt = crPrGr(pid, name, createdBy);
    }
    if(!name){
      return false;
    }else{
      quf(crt);
      
      this.setState({
        open: !this.state.open,
        input: [],
      })
      this.props.refetch();
      this.props.parentupd();
    }

  }

  chkbx() {
    this.setState({
      chk: !this.state.chk,
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
  
  _open(){
    this.setState({
      open: !this.state.open, 
    })

  }
  


  render() {
    
    if(this.state.open){
      return(
        <div className="tile">
          <div><input type="text" name="0" placeholder="Наименование" value={this.state.input[0]} onChange={this._input} /></div>
          
          {this.state.chk ? (
            <div>
              <input type="text" name="1" value={this.state.input[1]} placeholder="Описание" onChange={this._input} />
            </div>
          ) : (
            ""
          )}

          <div className="chkbx-frame" onClick={this.chkbx}>
            <span className="chkbx-label">проект?</span><span className={this.state.chk ? "chkbx active" : "chkbx"}></span>
          </div>
          <div className="button" onClick={this._create}>Добавить</div>
        </div>
      );
    }else{
      return(
        <div className="tile" onClick={this._open}>
          <svg className="svg-add" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        </div>
      );
    }

  }
}


CrTile.propTypes = {
  refetch: PropTypes.func,
};