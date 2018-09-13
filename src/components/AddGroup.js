import React, { Component, Fragment } from 'react'


export default class AddGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            closed: true,
            input: [],
        };
        this.openCard = this.openCard.bind(this);
        this.create =  this.create.bind(this);
    }

    openCard(){
        this.setState({
            closed: false,
        })
    }
    create(){
        this.setState({
            closed: true,
    })
}
    setNew(e){
        let old = this.state.input;
        let val = e.target.value;
        let num = Number(e.target.name);
        old[num] = val;

        this.setState({
           input: old,
        })
        console.log(this.state.input);
    }



    render() {
        if(this.state.closed){
            return (
                <div className="card add" onClick={this.openCard}>
                  
                  <div>
                    <svg className="plus" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                    </svg>
                  </div>
                </div>
            )
        }else{
            return (
                <div className="card">
                    <input type="text" name="0" value={this.state.input[0]} placeholder="Название" onChange={this.setNew.bind(this)}/>
                    <input type="text" name="1" value={this.state.input[1]} placeholder="описание" onChange={this.setNew.bind(this)}/>
                    <div className="open" onClick={this.create}>Создать</div>
                </div>
            )
        }

    }
}