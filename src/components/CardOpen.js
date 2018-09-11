import React, { Component } from 'react';


export default class Column extends Component<Props> {
  render() {
    const title: string = this.props.title;
    const quotes: Quote[] = this.props.quotes;
    const index: number = this.props.index;
    return (
        <div className="taskModule">
        <div className="content">
        <div className="scroller">
            <div className="inner">
                Задача
            </div>
            <div className="inner">
                <input type="text" placeholder="" value=""/>
                <textarea></textarea>
            </div>
            <div className="inner">

            </div>
            <div className="inner">

            </div>

        </div>
        <div className="bottom">
        <div className="btn" onClick={()=>{this.setState({taskModule: false})}}>
            закрыть
        </div>
        </div>
        </div>
    </div>
    );
  }
}