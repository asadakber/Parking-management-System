import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import * as firebase from 'firebase';
// import FlatButton from 'material-ui/FlatButton';
// import TextField from 'material-ui/TextField';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import TableFormRow from './feedbackForm';

class AllFeedbacks extends Component{
    constructor(){
        super();
        this.state = {
            feedbacks: [],
            keys: [],
            reply: '',
            form: false,
            adminReply: false,
            replys: [],
        };
    };
    componentDidMount(){
        firebase.database().ref(`/feedbacks`).on('value', snap => {
            let data = snap.val();
            let keys = [];
            let feedbacks = [];
            let replys = [];
            for(let key in data){
                console.log(key, ':::', data[key]);
                let data1 = data[key];
                for(var key1 in data1){
                }
                    if(data1[key1]['reply']){
                        console.log(data1[key1]['reply']);
                        replys.push(data1[key1]['reply']);
                    }
                console.log(replys);
                feedbacks.push(data[key]);
                keys.push(key);
            };
            this.setState({feedbacks, keys, replys});
            // console.log(this.state.feedbacks, this.state.keys);
        });
    };
    render(){
        console.log(this.state.replys)
        return(
            <Paper style={styles.paper} zDepth={1}>
                <h1>Feedbacks</h1>
                <Table style={{backgroundColor: 'grey'}}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn style={{width: 20,color: '#FFF'}}>ID</TableHeaderColumn>
                        <TableHeaderColumn style={{width: 60,color: '#FFF'}}>Name</TableHeaderColumn>
                        <TableHeaderColumn style={{width: 100,color: '#FFF'}}>Feedback</TableHeaderColumn>
                        <TableHeaderColumn style={{width: 100,color: '#FFF'}}>Admin Reply</TableHeaderColumn>                                                
                        <TableHeaderColumn style={{width: 200,color: '#FFF'}}>Reply</TableHeaderColumn>                        
                    </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                    {
                        this.state.feedbacks.map((feedback, index) => {
                            return (
                                <TableFormRow  key={index.toString()} feedback={feedback} index={index} />
                            );
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
        width: '90%',
        height: 'auto',
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
        backgroundColor: 'grey',
        color: '#FFF',
        opacity: 0.9
    },
};
  
export default AllFeedbacks;