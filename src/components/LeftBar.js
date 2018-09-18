import React, { Component } from 'react';
import Appср from '../chat/App';

class LeftBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: true
    }
  }

  hidePanel = () => {


  }

  render() {

    switch (this.props.barstate) {

    case "chat":
      return (
        <div className="left-bar">
          <Appср />
        </div>
      )
    case "fire":
      return (
        <div className="left-bar">
          <div className="left-bar-inner fire">
            <div className="scroller">
              <div className="message firetes">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="12" cy="19" r="2" />
                  <path d="M10 3h4v12h-4z" />
                  <path fill="none" d="M0 0h24v24H0z" />
                </svg>
                <span className="body">
                  <div className="user">от: <span className="name">А.Ю. Лакшери</span> кому: <span className="to">С.И. Иванову</span>
                    <div className="date">12 сен'18</div>
                    <div className="content">content</div>
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    case "favor":
      return (
        <div className="left-bar">
          <div className="left-bar-inner favor">
            <div className="scroller">
              <div className="message favorites">
                <span className="body">
                  <div className="content">Проект Казарма Центрального округа М.О.</div>
                  <div className="date small">добавлено: 10 сен'18<span className="name"> А.Ю. Пугачёвой</span></div>
                </span>
              </div>
              <div className="message favorites">
                <span className="body">
                  <div className="content">Проект Строительство Центра ПВО</div>
                  <div className="date small">добавлено: 12 сен'18<span className="name"> Ж.П. Киркоров</span></div>
                </span>
              </div>
            </div>
          </div>
        </div>
      )

    default:
      return (
        <div className="left-bar">
          <Appср />
        </div>
      )
    }


    // if(this.props.lstate){
    //   return (
    //   <div className="left-bar">
    //       <Appср/>
    //   </div>
    //   )
    // }else{
    //   return true;
    // }

  }
}

LeftBar.defaultProps = {
  isHidden: false
}

export default LeftBar
