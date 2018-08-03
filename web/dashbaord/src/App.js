import React, { Component } from 'react';

import ReactPlayer from 'react-player'
import io from 'socket.io-client';

import logo from './graph/logo-header.png'
import cameras from './graph/cameras-header.png'


import Gauge from 'react-svg-gauge';

import './App.css';
var shotsHistory = [];

const shotStateD = (col) => {
  
  if (col > 9) {
    var shots  = [0,1,0,1,0,1,0,0,1,0,0,0,0,1,0,1,1,1,1,0,0,0,1]     
  } else {
    var shots  = [0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,1,1,1,1,0,0,0,1]     
  }

  return shots[(Math.floor((Math.random() * 22) + 1)) -1];
}
class App extends Component {
  constructor(props) {
    super(props);
    this.gaugBox = React.createContext();
    this.state = {
      detections : [
        
      ], 
      playing : true
      ,
      block : 1,
      totalEntry : 0,
      crowdRate : 0,
      history : []
      
    }
  }
  render() {
    return (
      <div className="App" >
        <header style={{background: '#00685F' , height: '45px'}}>
          <img src={logo} style={{float: 'right'}}/>
          <span style={{float: 'right', paddingTop: '10px' , color : 'white'}}>مستخدم تجريبي</span>
        </header>
        <div style={{height : '76px'}}>
        <img src={cameras} style={{float: 'right'}}/> 
        </div>
        
        
        <div style={{
          display : 'flex',
          flexFlow: 'row',
          alignItems : 'center'                        
        }} >
            <div  style={{width:963,height:542,position: 'relative' , margin:'20px' }}>
                {this.state.detections.map( (obj , i) =>               
                  <div key={i}  style={{position: 'absolute', display:'block', top : obj.top , left : obj.left ,  width : obj.w , height: obj.h , border: 'solid #FFEC00 3px'}}></div>
                  )}            
                <ReactPlayer  width={963} height={542} url="jamarat.mp4" playing={this.state.playing} />
            </div>
            
            <div style={{ margin:'20px' }}>
            <Gauge value={this.state.totalEntry} width={450} height={320} max={1000} color={this.state.totalEntry < 600 ? '#00685F' : (this.state.totalEntry < 800 ? '#F7A43E' : '#F70054') } label="Total Jamart (1) " />  
            </div>

        </div>
      </div>
    );
  }



  componentDidMount() {
    var self = this ;
    var socket = io('http://localhost:9000');
    //socket.emit('play', {});
    socket.on('detections' , (msg) => { 
      
      console.log('detections');
      
     
      self.setState({playing : true , detections :  msg.map( (obj , i) => {
            return { title : 'person' , left : 10.0 - (963 / (obj.x + 1) * 20) , top : 10 - (542 / (obj.y + 1) * 20)   , w : 100 , h : 100}
        })});
       
    });

    
 

    setTimeout(() => {      
      // for explantion only no logic here 
      setInterval(() => {
        self.setState((prevState) => {       
            var newId =      Math.random()
            .toString(36)
            .substring(2, 15);          
            const shotData = {playing : true ,  detections : [{ title : 'person' , left :  prevState.block * 40, top :  542 - 70  , w : 45 , h : 60}] , block : prevState.block === 22 ?  0 :  prevState.block + 1 , shotState : shotStateD(prevState.block) === 0 ? false : true , shotID : newId}             
            if (shotData.shotState) {
              shotsHistory.push({id :  newId, data : shotData});
            }            
            return {...shotData,totalEntry : shotsHistory.length}
        });        
      }, 100);

    }, 1500);
  }
}



export default App;
