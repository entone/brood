import { receiveAction, receiveDataPoint, receiveData, receiveImage, receiveChannelSettings, receiveAuthentication } from '../actions';
import * as types from '../types';
import store from '../store';
import { host } from '../common/config'
const ReconnectingWebSocket = require('reconnecting-websocket');

var loc = window.location, uri;
var h = host();
if(!h){
  if (loc.protocol === "https:") {
      uri = "wss:";
  } else {
      uri = "ws:";
  }
  uri += "//" + loc.host;
  uri += "/ws";
}else{
  uri = h
}

const socket = new ReconnectingWebSocket(uri);
var interval = null;
socket.onmessage = message_handler;
socket.onopen = connect_handler;
socket.onclose = close_handler;
socket.onerror = error_handler;

export const emit = (action) => socket.send(JSON.stringify(action));
export const close = () => socket.close();

function message_handler(message){
  var data_p, action;
  try{
    data_p = JSON.parse(message.data);
  }catch(e){
    try{
      var r = new FileReader();
      r.readAsBinaryString(message.data);
      r.onloadend = () => {
        var image = r.result;
        store.dispatch(receiveImage(image));
      }
    }catch(e){}
    data_p = {type: "NULL"};
  }
  switch(data_p.type){
    case types.RECEIVE_AUTHENTICATION:
      action = receiveAuthentication(data_p.payload);
      break;
    case types.RECEIVE_DATA_POINT:
      action = receiveDataPoint(data_p.data_point);
      break;
    case types.RECEIVE_DATA:
      action = receiveData(data_p.data);
      break;
    case types.RECEIVE_ACTION:
      action = receiveAction(data_p.action, data_p.payload);
      break;
    case types.RECEIVE_CHANNEL_SETTINGS:
      action = receiveChannelSettings(data_p.payload);
      break;
  }
  if(action) store.dispatch(action);
}

function error_handler(e){
  console.log("WS Error");
  console.log(e);
}

function connect_handler(e){
  interval = setInterval(function(){
    socket.send("ping");
  }, 23000);
  console.log("WS connected");
  console.log(e);
  authorize();
}

function close_handler(e){
  clearInterval(interval);
  console.log("WS closed");
  console.log(e);
}

function authorize(){
  var user = localStorage.getItem('user');
  if(user){
    var token = JSON.parse(user).token;
    socket.send("Bearer "+ token);
  }else{
    socket.close();
  }
}
