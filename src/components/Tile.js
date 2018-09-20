import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { quf } from '../constants';

const delPRG = (thisid) => {
  return (
    `mutation{
          deleteProjectGroup(id: ${thisid})
      }`
  )
};

const delPR = (thisid) => {
  return (
    `mutation{
          deleteProject(id: ${thisid})
      }`
  )
};


export default class Tile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      status: false,
      key: 0
    };

  }

  _remove(id, type){
    let q = '';

    if(type === 'ProjectGroup'){
      q = delPRG(id);
    }else if(type === 'Project'){
      q = delPR(id);
    }else{
      return false;
    }
    quf(q);
    this.props.refetch();
    
  }

  render(){
    let type = '';
    let projgrlen = '';
    let projlen = '';
    let collen = '';

    if(this.props.full.projectGroups && this.props.full.projectGroups.length > 0){
      type = 'ProjectGroup';
      projgrlen = this.props.full.projectGroups.length;
    }else if(this.props.full.projects && this.props.full.projects.length > 0){
      type = 'Project';
      projlen = this.props.full.projects.length;
    }else if(this.props.full.columns && this.props.full.columns.length > 0){
      type = 'Board';
      collen = this.props.full.columns.length;
    }
    else{
      type = 'none';
    }

    return(
      <div className="tile">
        <div className="tile-name" onClick={()=>this.props.open(Number(this.props.id), type, this.props.name )}>{this.props.name ? this.props.name : this.props.title }</div>
        <div className="tile-id">id: {this.props.id}</div>
        <div className="tile-description">{this.props.full.description}</div>
        {projlen ? (<div className="tile-cod">Проектов: {projlen}</div>) :''}
        {projgrlen ? (<div className="tile-cod">Групп: {projgrlen}</div>) :''}
        {collen ? (<div className="tile-cod">Колонок: {collen}</div>) :''}
        <div className="tile-cod">{this.props.type}</div>
        <div className="tile-cod">{type}</div>
        <svg className="add-fav hov" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
          <path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z" />
          <path fill="none" d="M0 0h18v18H0z" />
        </svg>
        <div className="button del hov" onClick={()=>this._remove(Number(this.props.id), this.props.type )}>удалить</div>
      </div>
    );
  }
}


Tile.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  id: PropTypes.number,
  full: PropTypes.object,
  open: PropTypes.func,
  type: PropTypes.string,
  refetch: PropTypes.func,
};