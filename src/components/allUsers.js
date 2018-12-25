import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import * as firebase from 'firebase';
import FlatButton from 'material-ui/FlatButton';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

class AllUsers extends Component{
    constructor(){
        super();
        this.state = {
            users: [],
        };
    };
    removeButton = (uid) => {
        firebase.database().ref(`/users/${uid}`).remove();
    };
    componentDidMount(){
        firebase.database().ref(`/users`).on('value', snap => {
            // console.log(snap.val());
            let data = snap.val();
            let users = [];
            for(let key in data){
                if(data[key]['accountType'] === 'user'){
                    users.push(data[key]);
                }
            };
            this.setState({ users });
        });
    }; 
    render(){
        return(
            <Paper style={styles.paper} zDepth={3}>
                <h2>Users List</h2>
                <Table style={{backgroundColor: 'grey'}}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn style={{color: '#FFF'}}>ID</TableHeaderColumn>
                        <TableHeaderColumn style={{color: '#FFF'}}>Name</TableHeaderColumn>
                        <TableHeaderColumn style={{color: '#FFF'}}>Email</TableHeaderColumn>
                        <TableHeaderColumn style={{color: '#FFF'}}>Remove</TableHeaderColumn>                        
                    </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {
                            this.state.users.map((user, index) => {
                                return <TableRow key={index.toString()}>
                                    <TableRowColumn style={{color: '#FFF'}}>{index + 1}</TableRowColumn>
                                    <TableRowColumn style={{color: '#FFF'}}>{user.name}</TableRowColumn>
                                    <TableRowColumn style={{color: '#FFF'}}>{user.email}</TableRowColumn>                                    
                                    <TableRowColumn>{<FlatButton style={{backgroundColor: '#FFF', color: '#000'}}   label="Remove" onClick={()=> this.removeButton(user.uid)}  />}</TableRowColumn>                                                                        
                                </TableRow>
                            })
                        }
                    </TableBody>
                </Table>
            </Paper>
        );
    };
};
const styles = {
    paper: {
        width: 700,
        height: 'auto',
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
        backgroundColor: 'grey',
        color: '#FFF',
        opacity: 0.9
    },
};
export default AllUsers;