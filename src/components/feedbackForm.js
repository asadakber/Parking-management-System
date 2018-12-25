import React, { Component } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import * as firebase from 'firebase';

class TableFormRow extends Component{
    constructor(){
        super();
        this.state = {
            form: false,
        };
    };
    toggleForm = () => {
        this.setState({form: !this.state.form});
    };
    submitReply = (name) => {
        const { reply } = this.state;
        console.log(reply, name);
        if(reply){
            let UID = '';
            firebase.database().ref(`/feedbacks`).on('value', snap => {
                let data = snap.val();
                for(let key in data){
                    if(name === data[key]['name']){
                        UID = key;
                    }
                };
            });
            firebase.database().ref(`/feedbacks/${UID}/`).update({reply});
            this.setState({reply: '', form: false});
            alert('successfully send...');
        }else{
            alert('Enter Message...');
            this.setState({form: false});
        };
    };
    render(){
        console.log(this.props)
        const { index, feedback } = this.props;
        return(
            <TableRow key={index.toString()}>
                <TableRowColumn style={{width: 20, color: '#FFF'}}>{index + 1}</TableRowColumn>
                <TableRowColumn style={{width: 60, color: '#FFF'}}>{feedback.name}</TableRowColumn>
                <TableRowColumn style={{width: 100, color: '#FFF'}}>{feedback.feedback}</TableRowColumn>
                <TableRowColumn style={{width: 100, color: '#FFF'}}>{feedback.reply}</TableRowColumn>                            
                <TableRowColumn style={{width: 200, color: '#FFF'}}>
                    {
                        this.state.form ? <form onSubmit={(e)=> {e.preventDefault();this.submitReply(feedback.name)}}><TextField
                        onChange={(e) => this.setState({reply: e.target.value})}
                        floatingLabelText="Reply..."
                        />
                        <FlatButton style={{backgroundColor: '#FFF', color: '#000'}} background='red' label="Send" type='submit' primary={true} />
                        <FlatButton style={{backgroundColor: '#FFF', color: '#000'}} label="Cancel" onClick={this.toggleForm} primary={true} />
                        </form>
                        : <FlatButton style={{backgroundColor: '#FFF', color: '#000'}} label="Reply" onClick={(e)=> { e.preventDefault(); this.toggleForm()}}  />
                    }
                </TableRowColumn>                        
            </TableRow>
        );
    };
};

export default TableFormRow;
