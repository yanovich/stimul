import React, { Component } from 'react'
import {quf} from '../constants';


const crPrGr = (parentId, name, createdBy) => {
    return(
        `mutation{
            createProjectGroup(name: "${name}", parentId: ${parentId}, createdBy: ${createdBy}){
                id
                name
            }
        }`
        )
};

const crPrj = (title, name, description, createdBy, parentId) => {
    return(
        `mutation{
            createProject(name: "${name}", title: ${title}, description: ${description}, parentId: ${parentId}, createdBy: ${createdBy}){
                id
                name
            }
        }`
        )
};


export default class AddGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            closed: true,
            input: [],
            chk: false,
        };
        this.props = props;
        this.openCard = this.openCard.bind(this);
        this.create =  this.create.bind(this);
        this.chkbx =  this.chkbx.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    chkbx(){
        this.setState({
          chk: !this.state.chk,
        })
      }
      
    openCard(){
        this.setState({
            closed: false,
        })
    }

    
    create(){

    //let pid = this.props.match.params.id;

    let pid = 1;
    // if(!pid){
    //     pid = 1;
    // }
    if(this.state.chk){
        let parent = 1;
        let name = this.state.input[0];
        let title = this.state.input[1];
        let description = this.state.input[2];

        let createdBy = 1;
        let crt = crPrj(title, name, description, createdBy, parent);
        quf(crt);
        this.props.refresh();
        this.setState({
            closed: true,
            input: [],
        });
    }else{
        let parent = 1;
        let name = this.state.input;
        let createdBy = 1;
        let crt = crPrGr(parent,name,createdBy);
        quf(crt);
        this.props.refresh()
        this.setState({
            closed: true,
            input: [],
        });
        }
    }
    handleChange(e) {
        let old = this.state.input;
        let val = e.target.value;
        let num = Number(e.target.name);
        old[num] = val;

        this.setState({
           input: old,
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
    }

    render() {
        // console.log(this.props)
        // console.log(this.state)

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
                    <div></div>
                    <input type="text" name="0" value={this.state.input[0]} placeholder="Название"  onChange={this.handleChange}/>
                    
                    {this.state.chk ? (
                        <div>
                            <input type="text" name="1" value={this.state.input[1]} placeholder="title"  onChange={this.handleChange}/>
                            <input type="text" name="2" value={this.state.input[2]} placeholder="description"  onChange={this.handleChange}/>
                        </div>
                    ) : (
                        ""
                    )}
                    
                    
                    
                        <div className="chkbx-frame" onClick={this.chkbx}>
                            <span className="chkbx-label">проект?</span><span className={this.state.chk ? "chkbx active" : "chkbx"}></span>
                        </div>
                    <div className="open" onClick={this.create}>Создать</div>
                </div>
            )
        }

    }
}