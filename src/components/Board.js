import React, { Fragment } from 'react';
import {CreateTask} from './CreateTask';
import CreateCol from './CreateCol';
import DropCol from './DropCol';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";



const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

class Board extends React.Component{
    constructor(props) {
        super(props)
        this._parentUp = this._parentUp.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.state = {
            update: false,
            key: 0,
            u: 0,
            taskModule: false,
            _tasks: [],
            _cols: [],

        };
    }
    u = (refetch)=>{
        setInterval(()=>{
            refetch();
            //this.setState({u: this.state.u+1});
            //console.log('u')
          }, 2000);
      }
    _addCols = (arr)=>{
        this.setState({
            cols: arr,
        })
    }
    _openTask = (data)=>{
        this.setState({
            taskModule: true,
        })
    }
    _addTasks = (arr)=>{
        this.setState({
            tasks: arr,
        })
    }
    _parentUp = ()=>{
        //this.forceUpdate();
    }
    forceUpdateHandler(){
        this.forceUpdate();
    };

    // onDragEnd = (result, items) => {
    //     if (!result.destination) return;
    //     const oldIndex = result.source.index;
    //     const newIndex = result.destination.index;

    //     var item = items.get(oldIndex);

    //     this.setState({
    //         items: items.delete(oldIndex).insert(newIndex, item),
    //     });
    // };

    onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                source.droppableId,
                source.index,
                destination.index
            );
            // return(
            //     <Mutation mutation={VOTE_MUTATION} variables={{ linkId: this.props.link.id }}>
            //                 {voteMutation => (
            //                 <div className="ml1 gray f11" onClick={voteMutation}>
            //                     ▲
            //                 </div>
            //                 )}
            //     </Mutation>
            // )
            
            let state = { items };

            // if (source.droppableId != destination.droppableId) {
            //     state = { selected: destination.droppableId };
            // }

            // this.setState(state);
        } else {
            const result = move(
                source.droppableId,
                destination.droppableId,
                source,
                destination
            );

            // this.setState({
            //     items: result.droppableId,
            // });
        }
    };


    render(){
        let pid = this.props.match.params.id || 1;
        console.log(this.props);
        let _LIST = {
            cols: {},
            cards:{}
        };
        //let pid = this.props.pid.pid || 1;
        //let pid = this.props.match.params.id || 1;
        if(this.state.taskModule === true){
            return(
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
            )
        }else{
            return(
                <Fragment>
                <Query query={GCOL_BID} variables={{pid: pid}}>
                {({ loading, error, data, refetch }) => {
                  if (loading) return "Loading...";
                  if (error) return `Error! ${error.message}`;
                  let howmcols = data.columns.length;
                    this.u(refetch);
                    _LIST.cols = data.columns;
                    // this.setState({
                    //     _cols: _LIST.cols
                    // });
                    // console.log("_LIST");
                    // console.log(_LIST);
                    // data.columns.map((cols, i, arr)=>{
                    //     cols.tasks.map((task, i, arr)=>{
                    //         _LIST.cards.push(task)
                    //     })
                    // });
                    console.log(_LIST);
                    return (
                        <div className="lists">
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            {  data.columns.map((cols, i, arr) => {


                                
                                
                                return(
                                    <div className="column" key={i} order={cols.order}>
                                    <div className="colHeader">
                                        <div className="colName">{cols.name}</div>
                                        {/* <div className="small">{i}</div> */}
                                        {/* <div className="small">id: {cols.id}</div> */}
                                    </div>
                                    
                                    <Droppable droppableId={'drop'+cols.id} key={'drop'+i} direction="vertical">
                                    {provided => (
                                        <div className="column-content" ref={provided.innerRef} {...provided.droppableProps}
    
                                        >
                                        {
                                                cols.tasks.map((task, i, arr)=>{
                                                    return(
                                                    <Draggable draggableId={cols.id+''+i} key={'drag'+i} index={cols.id+''+i}>
                                                    {provided => (
                                                    <div className="task" key={'task'+i} ref={provided.innerRef}
                                                                                        {...provided.draggableProps}
                                                                                        {...provided.dragHandleProps}
                                                    >
                                                    <div className="taskHeader" onClick={()=>{this._openTask(task.id)}}>
                                                        <div className="taskName">{task.name}</div>
                                                        <div className="small">{cols.id+''+i}</div>
                                                        {/* <div className="micro">id: {task.id}</div> */}
                                                    </div>
                                                        <div className="taskDescr">{task.description}</div>
                                                        <div className="open small">открыть</div>
                                                        {provided.placeholder}
                                                    </div>)}
                                                    </Draggable>
                                                    )
    
                                                })}
                                                {provided.placeholder}
                                                </div>
                                    )}
                                    </Droppable>
                                            <CreateTask columnId={cols.id} update={this._parentUp} refetch={() => refetch()}/>
                                            <DropCol columnId={cols.id} update={this._parentUp} refetch={() => refetch()}/>
                                    </div>
                            
                            )
                            }
                        )}
                        </DragDropContext>
                        <CreateCol projectId={pid} update={this._parentUp} refetch={() => refetch()} />
                        </div>
                      )
                }}
                
              </Query>
              </Fragment>
            )
        }

    }

}


export default Board;


const UPD_TASK = gql`
mutation updateTask($id: String!, $columnId: Int!, $index: Int){
    updateTask(id: $id , columnId: $columnId, index: $index) {
      id
      index
      name
      description
    }
  }
`;

const GTSK_BID = gql`
query getTasks($id: Int!) {
    tasks(columnId: $id) {
      id
      name
      description
    }
  }
`;

export const GCOL_BID = gql`
  query getByPid($pid: Int!) {
    columns(projectId: $pid){
      name
      order
      id
      project {
        id
      }
      tasks {
        id
        name
        description
      }
    }
  }
`