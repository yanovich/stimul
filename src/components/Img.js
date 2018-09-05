import React, { Component, Fragment } from 'react';
//import { Link } from 'react-router-dom';


class Img extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: false
    }
  }
  render() {
    return (
        <div className="profile-image">
            <img src={this.props.src} />
        </div>
    )
  }
}


export default Img;
