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


export default class CrRow extends Component {

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
  _close(){
    this.setState({
      open: !this.state.open, 
    })

  }
  


  render() {
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
  }
}


CrTile.propTypes = {
  refetch: PropTypes.func,
};