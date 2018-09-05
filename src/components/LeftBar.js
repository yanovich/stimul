import React, { Component } from 'react'
import Appср from '../CHAT/App';

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
      
    return (
        <div className="left-bar">
            <Appср/>
        </div>
    )
  }
}

LeftBar.defaultProps = {
  isHidden: false
}

export default LeftBar
