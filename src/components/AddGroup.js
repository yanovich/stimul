import React, { Component } from 'react';
import { quf } from '../constants';


const crPrGr = (parentId, name, createdBy) => (
  `mutation{
            createProjectGroup(name: "${name}", parentId: ${parentId}, createdBy: ${createdBy}){
                id
                name
            }
        }`
);

const crPrj = (title, name, description, createdBy, parentId) => (
  `mutation{
           createProject(name: "${name}", title: "${title}", description: "${description}", parentId: ${parentId}, createdBy: ${createdBy}){
                id
                name
            }
        }`
);


export default class AddGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closed: true,
      input: [],
      chk: false,
    };
    this.props = props;
    this.openCard = this.openCard.bind(this);
    this.create = this.create.bind(this);
    this.chkbx = this.chkbx.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  chkbx() {
    this.setState({
      chk: !this.state.chk,
    });
  }

  openCard() {
    this.setState({
      closed: false,
    });
  }


  create() {
    // let pid = this.props.match.params.id;
    let pid = Number(this.props.pid);

    if (!pid) {
      pid = 1;
    }
    if (this.state.chk) {
      const name = this.state.input[0];
      const title = this.state.input[1];
      const description = this.state.input[2];

      const createdBy = 1;
      const crt = crPrj(title, name, description, createdBy, pid);

      quf(crt);
      // this.props.refresh();
      this.setState({
        closed: true,
        input: [],
      });
    } else {
      const name = this.state.input;
      const createdBy = 1;
      const crt = crPrGr(pid, name, createdBy);

      quf(crt);
      // this.props.refresh();
      this.setState({
        closed: true,
        input: [],
      });
    }
  }

  handleChange(e) {
    const old = this.state.input;
    const val = e.target.value;
    const num = Number(e.target.name);

    old[num] = val;

    this.setState({
      input: old,
    });
  }

  setNew(e) {
    const old = this.state.input;
    const val = e.target.value;
    const num = Number(e.target.name);

    old[num] = val;
    this.setState({
      input: old,
    });
  }

  render() {
    if (this.state.closed) {
      return (
        <div className="card add" onClick={this.openCard}>
          <div>
            <svg className="plus" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
          </div>
        </div>
      )
    }

    return (
      <div className="card">
        <div></div>
        <input type="text" name="0" value={this.state.input[0]} placeholder="Название" onChange={this.handleChange} />

        {this.state.chk ? (
          <div>
            <input type="text" name="1" value={this.state.input[1]} placeholder="title" onChange={this.handleChange} />
            <input type="text" name="2" value={this.state.input[2]} placeholder="description" onChange={this.handleChange} />
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