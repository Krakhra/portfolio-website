import React, {Component} from 'react';
import request from 'superagent';
import './Recipe.css'

export default class Notes extends Component {
    constructor() {
        super();
        this.state = {
            notes:[],
            num: 0,
        }
    }
    componentDidMount(){
       fetch('/api/recipes')
       .then((res) =>{
            return res.json()
       })
       
       .then((resJson) =>{
           console.log(resJson);
           this.setState({
                notes:resJson,
                num:resJson.length
           });
       })
    }

    removeNote(id){
        var notes = this.state.notes;
        var note = notes.find(function(note){
            return note.id === id
        });
        console.log(note);

        request 
            .del('/api/notes/deleteNote/' + note.id)
            .send({id:note.id})
            .set('X-API-key',"note")
            .set('accept','json')
            .end((err,res) =>{
                if(err){
                    console.log(err)
                }
            })
        for(var i=0; i<notes.length; i++){
            if(notes[i].id === id){
                notes.splice(i,1);
            }
        }
        this.setState({notes:notes})
    }

    addNote(event){
        event.preventDefault();
        
        var newNum = this.state.notes[this.state.notes.length - 1].id + 1;
        this.setState({num:newNum},function(){
            var newArray = this.state.notes;
            let data ={
                name:this.refs.name.value,
                id:this.state.num,
            };

            request 
                .post('/api/notes/newNote')
                .send({data})
                .set('X-API-key',"newNote")
                .set('accept','json')
                .end((err,res) =>{
                    if(err){
                        console.log(err)
                    }
                })

            newArray.push(data);
            this.setState({notes:newArray},function(){
                console.log(this.state);
            });
        });
    }

    render(){
        return(
            <div className = "noteContainer">
                <h5>React Notes!</h5>
                <div className= "cont">
                    {
                        this.state.notes.map((notes)=>{
                            return(
                                <ul key = {notes.id}>
                                    <div className = "noteBlock panel-heading" >
                                        <h6 className = "panel-title">
                                            {notes.name} <button onClick = {this.removeNote.bind(this,notes.id)}>Remove</button>
                
                                        </h6>
                                    </div>
                                </ul>
                            );
                        })
                    }
                    <form ref="noteForm">
                        <input type = "text" ref ="name" placeholder= "Note.."/>
                        <button onClick={this.addNote.bind(this)}>Add Note</button>
                    </form>
                </div>
            </div>
        );
    }
}