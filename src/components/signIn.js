import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SignUp from './signUp';
import LinearProgress from 'material-ui/LinearProgress';
import * as firebase from 'firebase';

class SignIn extends Component{
    constructor() {
    super();
        this.state = {
            value: 'a',
            email: '',
            password: '',
            error: '',
            loading: false,
        };
    };
    handleChange = (value) => {
        this.setState({
          value: value,
        });
    };
    submitForm = (e) => {
        e.preventDefault();
        const { email, password } = this.state;
        if(email && password){
            this.setState({loading: true});
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((user)=>{
                    if(user.uid === 'XzL7eqbEG4eH1cQ34Yp8Wou5sH63') {
                        this.props.history.push('/admin');
                    }
                    firebase.database().ref(`/users/${user.uid}`).on('value', snap => {
                        let data = snap.val();
                        if(data){
                            let accountType = snap.val()['accountType'];
                            if(accountType === 'user'){
                                this.props.history.push('/home');
                            }else{
                                // this.props.history.push('/home');
                            }
                        }else{
                            // user.delete().then(() => {
                            //     firebase.database().ref(`/bookings/${user.uid}`).remove();
                            //     this.setState({error: 'delete by admin', loading: false});
                            // });
                        };
                    });
                })
                .catch((error)=>{
                    this.setState({ error: error.message, loading: false });
                });
        }else{
            this.setState({error: 'Please Enter all fields...'});
        };
    };
    render(){
        return(
            <div  style={styles.main}>
                <Paper  style={styles.paper} zDepth={5} >
                <Tabs  
                        value={this.state.value}
                        onChange={this.handleChange}
                    >
                        <Tab  style={{height: '70px', backgroundColor: '#FFFFFF', color: 'black'}} label="Login" value="a">
                        <div style={{marginLeft: '25%', marginTop: '15%'}}>
                            <h2 style={styles.headline}>Login</h2>
                            <form onSubmit={this.submitForm}>
                                <TextField
                                    onChange={(e)=> this.setState({email: e.target.value, error: ''})}
                                    hintText="user@gmail.com"
                                    floatingLabelText="Email address..."
                                /><br />
                                <TextField
                                    onChange={(e)=> this.setState({password: e.target.value, error: ''})}                                
                                    hintText="***************"                                
                                    floatingLabelText="Enter password..."
                                    type="password"
                                /><br />
                                <span><p style={styles.message}>{ this.state.error }</p></span>
                                {
                                    <RaisedButton  type='submit' label='Login' style={styles.button} />
                                }
                            </form>
                        </div>
                        </Tab>
                        <Tab style={styles.tab} to='./signUp' label="SignUp" value="b">
                        <div>
                            <h2 style={styles.headline}><SignUp abc={this.props}/></h2>
                        </div>
                        </Tab>
                    </Tabs>
                </Paper>
            </div>
        );
    };
};
const styles = {
    paper: {
        height: '600px',
        width: '450px',
        margin: 60,
        textAlign: 'center',
        display: 'inline-block',
        borderRadius: '5px',
        opacity: 0.9,
        backgroundColor: 'grey',
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid' 
    },
    message: {
        color: 'red',
        fontSize: 20,
        marginRight: '15px',
    },
    progress: {
        width: '75%',
        marginTop: '40px',
    },
    headline: {
        fontSize: 24,
        paddingLeft: 70,        
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
    },
    button: {
        marginTop: '15px',
        marginLeft: '70px',
        backgroundColor: 'black'
    },
    main: {
        width: '100%',
        height: '745px',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    },

    tab: {
        backgroundColor: 'white',
        color: 'black'
    }
};

export default SignIn;