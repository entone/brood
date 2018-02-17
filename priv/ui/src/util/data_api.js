import { receiveData } from '../actions';
import store from '../store';
import { account } from '../common/config'

var loc = window.location, uri;
var h = account();
if(!h){
  if (loc.protocol === "https:") {
      uri = "https:";
  } else {
      uri = "http:";
  }
  uri += "//" + loc.host;
}else{
  uri = h
}

uri += "/data";

function param(key, params){
  return params[key] ? "/"+params[key] : "";
}

function url_params(params){
  return param("kit", params)
    + param("aggregator", params)
    + param("measurement", params)
    + param("tag", params)
    + param("value", params)
    + param("from", params)
    + param("to", params)
    + param("bucket", params)
}

//params: {kit: required, aggregator: required, measurement: required, from: required, to: required, bucket: optional, tag: optional, value: optional}
export const get = (params) => {
  fetch(uri + url_params(params), {
    cache: "no-cache",
    headers: {
      "authorization": authorize(),
      "content-type": "application/json"
    },
    mode: "cors",
    method: "GET"
  })
  .then(response => response.json())
  .then(data => {
    var series = data.results[0].series || [{}]
    var d = series[0].values || [];
    store.dispatch(receiveData(params.measurement, d))
  })
}

function authorize(){
  var user = localStorage.getItem('user');
  if(user) return "Bearer " + JSON.parse(user).token;
  return false;
}
