import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Board extends Component {

  constructor(props) {
    super(props);
    this.state = {
      status: false,
      key: 0
    };
  }

  render(){
    let type = '';
    let projgrlen = '';
    let projlen = '';
    let collen = '';

    return(
      <div className="board">
        <div className="board-name" >{this.props.name ? this.props.name : this.props.title }</div>
        <div className="board-id">id: {this.props.id}</div>
        <div className="board-content">
          <div className="board-inner">
            
          </div>
        </div>
        <div className="board-bottom">
        
        </div>


        <svg className="add-fav hov" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
          <path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z" />
          <path fill="none" d="M0 0h18v18H0z" />
        </svg>
        <div className="button del hov">удалить</div>
      </div>
    );
  }
}


Board.propTypes = {
  name: PropTypes.string,
  id: PropTypes.number,
  full: PropTypes.object,
};