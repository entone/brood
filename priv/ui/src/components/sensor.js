import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import RealtimeGraph from './realtime-graph'

export default class Sensor extends Component {

  render = ({ title, list, name, graph_var, color}) => {
    var value = list.length ? list[list.length-1].data_point.value : 0;
    var out = [];
    if(typeof value == "object"){
      for(var k in value){
        var style = {"padding": "6px", "padding-right": "10px"}
        if(k == graph_var){
          style["background-color"] = color(.3);
          style["border"] = "1px solid "+ color(1);
        }
        out.push(<span style={style}>{k+": "+value[k]}</span>);
      }
    }else{
      out.push(<span style={{"padding": "3px", "padding-right": "10px"}}>{value}</span>);
    }
    return (
      <Card style={{"background-color": color(.2)}}>
        <Card.Primary style={{"background-color": color(.5)}}>
          <Card.Title style={{"color": color(0)}}>
            {title}
          </Card.Title>
        </Card.Primary>
        <Card.Media className='card-media' style={{"padding": "0px", "padding-top": "10px"}}>
          <div id={name}>
            <RealtimeGraph list={list} name={name} graph_var={graph_var} color={color} />
          </div>
        </Card.Media>
        <Card.HorizontalBlock style={{"background-color": color(.1)}}>
          <Card.Primary style={{"color": color(1)}}>
            {out.map((span) => span)}
          </Card.Primary>
        </Card.HorizontalBlock>
      </Card>
    );
  }
}
