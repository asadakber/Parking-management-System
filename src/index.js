import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyBnJOyJIMt_nDd2v9I-RUivddj2v-CD13M",
    authDomain: "parking-management-syste-31d70.firebaseapp.com",
    databaseURL: "https://parking-management-syste-31d70.firebaseio.com",
    projectId: "parking-management-syste-31d70",
    storageBucket: "parking-management-syste-31d70.appspot.com",
    messagingSenderId: "538482289878"
  };
  firebase.initializeApp(config);


ReactDOM.render(<MuiThemeProvider>
        <App />
    </MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();
