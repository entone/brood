import { createStore, applyMiddleware } from 'redux';
import * as types from './types';
import { sendMessage } from './actions';
import { emit } from './util/websocket'
import { num_data_points } from './common/config'


let ACTIONS = {
  AUTHENTICATED: ({...state}, {token}) => {
    var authed = {authenticated: token};
    return Object.assign(state, authed);
  },

  IMAGE: ({...state}, {payload}) => {
    var update = {image: payload};
    return Object.assign(state, update);
  },

  CHANNEL_SETTINGS: ({...state}, {payload}) => {
    return Object.assign(state, payload);
  },

  SEND_MESSAGE: ({...state}, {id, message, payload, send_backend}) => {
    var update = {}
    switch(message){
      case "actuator":
        update[id] = payload;
        break;
      case "time_change":
        update[id+"_start"] = payload.start;
        update[id+"_run_time"] = payload.run_time;
        break;
      default:
        break;
    }
		if(send_backend) emit({type: message, id: id, payload: payload});
		return Object.assign(state, update);
  },

  ACTION: function({...state}, {action, payload}){
    return state;
  },

	DATA: function({...state}, data){
    return state;
  },

	DATA_POINT: function({...state}, data_point){
		var obj = {};
		if(state[data_point.data_point.key] instanceof Array){
			obj[data_point.data_point.key] = [...state[data_point.data_point.key], data_point];
			if(obj[data_point.data_point.key].length > num_data_points){
				obj[data_point.data_point.key] = obj[data_point.data_point.key].slice(1, num_data_points+1);
			}
		}else{
			obj[data_point.data_point.key] = data_point.data_point.value
		}
		return Object.assign(state, obj);
  },

};

const INITIAL = {
	humidity: [],
	temperature: [],
	water_level_lower: [],
	water_level_upper: [],
  ph: [],
  ec: [],
  water_temperature: [],
  doxy: [],
	light_lower: 0,
  light_lower_start: 0,
  light_lower_run_time: 0,
	light_upper: 0,
  light_upper_start: 0,
  light_upper_run_time: 0,
	pump_upper: 0,
	pump_lower: 0,
	dose_upper: 0,
	dose_lower: 0,
  image: null,
  authenticated: false,
};

export default createStore( (state, action) => (
	action && ACTIONS[action.type] ? ACTIONS[action.type](state, action) : state
), INITIAL);
