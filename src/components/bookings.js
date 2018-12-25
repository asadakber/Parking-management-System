import React, { Component } from 'react';
import * as firebase from 'firebase';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

class Bookings extends Component{
    constructor(){
        super();
        this.state = {
            keys: [],
            values: [],
            noBooking: false,
        
        };  
    };
    cancelBooking = (areaName, userUID, index, slot, date, time) => {
 
        if(this.props.accountType === 'admin'){
            let areaKey;
            let deleteKey;
            firebase.database().ref(`/locations`).on('value', snap => {
                let data = snap.val();
                for(let key in data){
                    if(areaName === data[key]['areaName']){
                        areaKey = key;
                    }
                };
            
                firebase.database().ref(`/bookings/${areaKey}/${slot}/`).on('value', snap => {
                    let data1 = snap.val();
                    for(let key1 in data1){
                        console.log(data1[key1], userUID, slot, date, time);
                        if(data1[key1]['UID'] === userUID && data1[key1]['date'] === date && data1[key1]['time'] === time){
                            console.log(key1);
                            deleteKey = key1;             
                        }
                    };
                  
                    firebase.database().ref(`/bookings/${areaKey}/${slot}/${deleteKey}/`).remove();
                    firebase.database().ref(`/locations/${areaKey}/slots/${slot}`).update({booking: false});
                });                
            });
        
        }else{
            firebase.auth().onAuthStateChanged((user) => {
                let UID = user.uid;
                let deleteKey = '';
                firebase.database().ref(`/locations`).on('value', snap => {
                    let data = snap.val();
                    var areaKey = '';
                    for(let key in data){
                        let areaData = data[key].areaName;
                        if(areaData === areaName){
                            areaKey = key; 
                        }
                    }
                    firebase.database().ref(`/bookings/${areaKey}/${slot}`).on('value', snap => {
                        let data = snap.val();
                        for(let key in data){
                            if(data[key]['UID'] === UID && date === data[key]['date'] && time === data[key]['time'])
                            deleteKey = key;
                        }
                    })
                    console.log(areaKey, slot)
                    firebase.database().ref(`/bookings/${areaKey}/${slot}/${deleteKey}`).remove();
                    firebase.database().ref(`/locations/${areaKey}/slots/${slot}`).update({booking: false})
                });
            });
        };
    };
    componentDidMount(){
        if(this.props.accountType === 'admin'){
            firebase.database().ref(`/bookings`).on('value', snap => {
                let data = snap.val();
                if(data){
                    let keys = [];
                    let values = [];
                    for(let key in data){
                        let moreData = data[key];
                        for(let key in moreData){
                            let moreAndMoreData = moreData[key];
                            for(let key in moreAndMoreData){
                          
                                values.push(moreAndMoreData[key]);
                                keys.push(key);
                            }
                        };
                    };
                    this.setState({keys, values});
                }else{
                    this.setState({noBooking: true});
                }
            });
        }else{
            firebase.auth().onAuthStateChanged((user) => {
                let UID = user.uid;
                firebase.database().ref(`/bookings/`).on('value', snap => {
                  
                    let data = snap.val();
                    if(data){
                        let keys = [];
                        let values = [];
                        for(let key in data){
                     
                            let moreData = data[key];
                            for(let key1 in moreData){
                                let moreAndMore = moreData[key1];
                                for(let key2 in moreAndMore){
                                    console.log(moreAndMore[key2]['UID']);
                                    if(moreAndMore[key2]['UID'] === UID){
                                        keys.push(key);
                                    
                                        values.push(moreAndMore[key2]);
                                    }
                                }
                            }
                        }
                        console.log(values, keys)
                        this.setState({keys, values});
                    }else{
                        this.setState({noBooking: true});
                    }
                });
            });
        };
    };
    renderTime = (time) => {
        if(time === 0){
            return '12 A.M';
        }else{
            if(time > 12){
                return (time - 12) +' P.M'; 
            }else{
                return time + ' A.M';
            }
        }
    };
    render(){
        return(
            <div>
                {
                    this.state.noBooking ? <Paper style={{background: '#FF1493', height: '100px', lineHeight: '100px', marginTop: '150px'}} zDepth={3}><h1 style={{backgroundColor: 'grey', color: '#FFF', opacity: 0.9}}>You have No booking Yet...</h1></Paper> 
                    : <Paper style={styles.paper} zDepth={3}>
                    <Table style={{backgroundColor: 'grey',}}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn style={{width: '50px', color: 'white'}}>Slot No</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '200px', color: 'white'}}>Name</TableHeaderColumn>                        
                            <TableHeaderColumn style={{width: '100px', color: 'white'}}>Location</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '100px', color: 'white'}}>Date</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '70px', color: 'white'}}>Start Time</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '70px', color: 'white'}}>Hours</TableHeaderColumn>
                            <TableHeaderColumn style={{color: 'white'}}>Cancel Booking</TableHeaderColumn>                                                                        
                        </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                        {
                            this.state.values.map((val, index) => {
                                return <TableRow key={index}>
                                    <TableRowColumn style={{width: '50px', color: 'white'}}>{val.slot}</TableRowColumn>
                                    <TableRowColumn style={{width: '200px', color: 'white'}}>{val.email}</TableRowColumn>
                                    <TableRowColumn style={{width: '100px', color: 'white'}}>{val.areaName}</TableRowColumn>
                                    <TableRowColumn style={{width: '100px', color: 'white'}}>{val.date+'-'+(val.month + 1)+'-'+ val.year}</TableRowColumn>
                                    <TableRowColumn style={{width: '70px', color: 'white'}}>{this.renderTime(val.time-1)}</TableRowColumn>
                                    <TableRowColumn style={{width: '70px', color: 'white'}}>{`${val.hours} hour`}</TableRowColumn>
                                    <TableRowColumn><FlatButton onClick={(e) => {e.preventDefault(); this.cancelBooking(val.areaName, val.UID, index, val.slot, val.date, val.time)}} label="Cancel Booking" style={{background: '#FFFFFF', color: '#000'}} /></TableRowColumn>                                                                                                
                                </TableRow>
                            })
                        }       
                        </TableBody>
                    </Table>
                </Paper>
                }
            </div>
        );
    };
};
const styles = {
    paper: {
        width: '1200px',
        height: 'auto',
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
        backgroundColor: 'grey',
        opacity: 0.9
    },
};
export default Bookings;