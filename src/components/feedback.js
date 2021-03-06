import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import * as firebase from 'firebase';

class Feedback extends Component{
    constructor(){
    super();
        this.state = {
            feedback: '',
            error: '',
            successfully: '',
            reply: '',
            adminReply: false,
        };
    };
    submitButton = (e) => {
        e.preventDefault();
        this.setState({error: '', successfully: ''});
        if(this.state.feedback){
            firebase.database().ref(`/feedbacks/${this.props.UID}`).set({name: this.props.name, feedback: this.state.feedback})
                .then(()=>{
                    this.setState({successfully: 'Successfully Send', feedback: ''});
                });
        }else{
            this.setState({error: 'please enter text...'});
        };
    };
    componentDidMount(){
        firebase.database().ref(`/feedbacks/${this.props.UID}/`).on('value', snap => {
            let data = snap.val();
            let reply = '';
            if(data){
                // for(let key in data){
                    console.log(data['reply']);
                    if(data['reply']){
                        reply = data['reply'];
                        console.log(reply);
                        this.setState({adminReply: true, reply: reply})
                        // break;
                    // }    
                }
            }
        });
    };
    render(){
        return(
            <Paper zDepth={4} style={styles.paper}>
                <h1>Feedback</h1>
                <form onSubmit={this.submitButton}>
                    <TextField
                        onChange={(e)=> this.setState({feedback: e.target.value, error: ''})}
                        value={this.state.feedback}
                        floatingLabelText="Feedback..."
                    /><br />
                    <span><p style={styles.error}>{this.state.error}</p><p style={styles.successfully}>{this.state.successfully}</p></span>
                    <RaisedButton  type='submit' label="Send"  />
                </form>
                {
                    this.state.adminReply ? <div><h1 style={styles.reply}>From Admin: { this.state.reply}</h1></div> : ''
                }
            </Paper>
        );
    };
};

const styles = {
  paper: {
    width: 600,
    height: 300,
    margin: 20,
    marginTop: 100,
    textAlign: 'center',
    display: 'inline-block',
    backgroundColor: 'grey',
    color: '#FFF',
    opacity: 0.9
  },
  successfully: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 20,
  },
  reply: {
    fontSize: '20px',
    color: 'rgba(0,0,0,0.7)',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 20,
  },
};
export default Feedback;