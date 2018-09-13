import React, { Component } from 'react';
import Appср from '../chat/App';

class LeftBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: false
    }
  }

  hidePanel = () => {


  }

  render() {
      if(this.props.lstate){
        return (
        <div className="left-bar">
            <Appср/>
        </div>
        )
      }else{
        return true;
      }

  }
}

LeftBar.defaultProps = {
  isHidden: false
}

export default LeftBar
