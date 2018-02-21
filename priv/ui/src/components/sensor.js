import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import RealtimeGraph from './realtime-graph'

export default class Sensor extends Component {

  render = ({ title, list, name, graph_var, config}) => {
    var value = list.length ? list[list.length-1].data_point.value : 0;
    var out = [];
    if(typeof value == "object"){
      for(var k in value){
        var style = {"padding": "6px", "padding-right": "10px"}
        if(k == graph_var){
          style["background-color"] = config.color(.3);
          style["border"] = "1px solid "+ config.color(1);
        }
        out.push(<span style={style}>{k+": "+value[k]}{config.unit}</span>);
      }
    }else{
      out.push(<span style={{"padding": "3px", "padding-right": "10px"}}>{value}{config.unit}</span>);
    }
    return (
      <Card style={{"background-color": config.color(.2)}}>
        <Card.Primary style={{"background-color": config.color(.5)}}>
          <Card.Title style={{"color": config.color(0)}}>
            {title}
          </Card.Title>
        </Card.Primary>
        <Card.Media className='card-media' style={{"padding": "0px", "padding-top": "10px"}}>
          <div id={name}>
            <RealtimeGraph list={list} name={name} graph_var={graph_var} color={config.color} />
          </div>
        </Card.Media>
        <Card.HorizontalBlock style={{"background-color": config.color(.1)}}>
          <Card.Primary style={{"color": config.color(1)}}>
            {out.map((span) => span)}
          </Card.Primary>
        </Card.HorizontalBlock>
      </Card>
    );
  }
}
