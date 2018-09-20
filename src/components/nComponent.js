import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import PropTypes from 'prop-types';
import Tile from './Tile';
import TileCr from './TileCr';
import Column from './Column';
import Board from './Board';


export default class CreateCol extends Component {

  constructor(props) {
    super(props);
    this.state = {
      status: false,
      type: '',
      key: 0,
      id: 1,
      pid: 1,
      prevpid: 0, 
      previd: 0,
      upkey: 0,
      name: '',
    };

    this._add = this._add.bind(this);
    this._open = this._open.bind(this);
    this.parentup = this.parentup.bind(this);
  
  }

  _open(id, type, name){
    this.setState({
      id: id,
      type: type,
      name: name,
    })
  }


  parentup(){
    this.setState({
      upkey: this.state.upkey + 1,
    })
    
  }

  _add(){

  }

  render(){
    let id = this.state.id;

    console.log("prpsnc",this.props);

    if(false){
      return(
        <Fragment>
          <div className="errorMessage">Извините, Здесь пусто</div>
        </Fragment> 
      );
    }else{
      let q = '';


      if(this.state.type === "ProjectGroup" || !this.state.type){
        q = GET_BYPID;
      }
      else if(this.state.type === "Project"){
        q = GET_PRBYPID;
      }
      else if(this.state.type === "Board"){
        q = GET_BOARD;
      }
      else{
        q = GET_BYPID;
      }

      return(
        <Fragment>
          <div className="top-title">
            {this.state.name}
            <div className="top-type">{this.state.type}</div>
            <div className="top-id">{this.state.id}</div>
          </div>
          <Query query={q} variables={{ pid: id }}>
            {({ loading, error, data, refetch }) => {
              if (loading) return "Loading...";
              if (error) {
                console.warn(error.message);

                return(<div className="errorMessage">Не могу выполнить запрос</div>);
              }

              console.log(data);

              if(data){
                if(data.projectGroups && data.projectGroups.length > 0){
                  return(
                    <Fragment>
                      {data.projectGroups.map((o,i) => {
                        return(
                          <Tile key={'tile-'+i} name={o.name} id={o.id} refetch={refetch} full={o} type={o.__typename} remove={this._remove} open={this._open}/>
                        )
                      })}
                      <TileCr pid={this.state.id} refetch={refetch} parentupd={this.parentup}/>
                    </Fragment>
                  )
                }
                else if(data.projects && data.projects.length > 0){
                  return(
                    <Fragment>
                      {data.projects.map((o,i) => {
                        return(
                          <Tile key={'tile-'+i} name={o.name} title={o.title} id={o.id} refetch={refetch} full={o} type={o.__typename} remove={this._remove} open={this._open}/>
                        )
                      })}
                      <TileCr pid={this.state.id} refetch={refetch} parentupd={this.parentup}/>
                    </Fragment>
                  )
                }
                else if(data.project){
                  return(
                    <div className="board-inner">
                      {data.project.columns.map((o,i) => {
                        return(
                          <Column key={'tile-'+i} name={o.name} title={o.title} id={o.id} refetch={refetch} full={o} type={o.__typename} remove={this._remove} open={this._open}/>
                        )
                      })}
                      <TileCr pid={this.state.id} refetch={refetch} parentupd={this.parentup}/>
                    </div>
                  )
                }
                else{
                  return(
                    <Fragment>
                      <div className="mess">
                      Здесь нет данных
                      </div>
                      <TileCr pid={this.state.id} refetch={refetch} parentupd={this.parentup}/>
                    </Fragment>
                  )
                }

              }else{
                return(
                  <Fragment>
                    <div className="mess">
                      Нет данных
                    </div>
                    <TileCr pid={this.state.id} refetch={refetch} parentupd={this.parentup}/>
                  </Fragment>
                )
              }
            }}
          </Query>
          
        </Fragment>  
      );
    }

  }
}

export const GET_BYPID = gql`
  query getByPid($pid: Int!) {
    projectGroups(parentId: $pid) {
    id
    name
    parentId
    projectGroups{
        id
        name
        parentId
        projects{
            id
            title
        }
    }
    projects{
            id
            title
            parentId
        }
    }
  }
`;

export const GET_PRBYPID = gql`
  query getByPid($pid: Int!) {
  projects(parentId: $pid){
    id
    name
    title
    columns {
      id
    }
    createdAt
    description
  }
  }
`;

export const GET_BOARD = gql`
  query getByPid($pid: Int!) {
  project(id: $pid){
    id
    name
    title
    columns {
      id
      name
      tasks{
        id
        name
        description
      }
    }
    createdAt
    description
  }
  }
`;

CreateCol.propTypes = {

};