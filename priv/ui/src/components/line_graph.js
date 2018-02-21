import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import * as d3 from 'd3';
import { connect } from 'preact-redux';
import * as actions from '../actions';
import reduce from '../reducers';

@connect(reduce, actions)
export default class LineGraph extends Component {

  constructor(props){
    super(props);
    this.state = {
      name: props.name,
      data: [[0, 0]]
    }
  }

  shouldComponentUpdate = ({...state}) => {
    var s_data = state[this.state.name+"_data"] || [[1, 1]];
    if(s_data[0] && this.state.data[0] !== s_data[0]){
      var data = s_data;
      this.setState({data: data});
      this.x.domain(d3.extent(data, function(d) { return new Date(d[0]); }));
      this.y.domain(d3.extent(data, function(d) { return d[1]; }));
      this.x_axis.ticks(Math.floor((this.width/110)));
      this.path.data([data]).attr('d', this.line)
      d3.select("#"+this.props.name+"_x").remove();
      d3.select("#"+this.props.name+"_y").remove();
      this.svg.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .attr("id", this.props.name+"_x")
        .call(this.x_axis);
      this.svg.append("g")
        .attr("id", this.props.name+"_y")
        .call(this.y_axis);
    }
    return false;
  }

  componentDidMount = ({...state}) => {
    this.width = document.getElementById(this.props.name).clientWidth;
    var margin = {top: 20, right: 20, bottom: 30, left: 50};
    var width = this.width - margin.left - margin.right;
    var height = 300 - margin.top - margin.bottom;
    this.height = height;

    this.x = d3.scaleTime().range([0, width]);
    this.y = d3.scaleLinear().range([height, 0])

    this.x_axis = d3.axisBottom(this.x);
    this.y_axis = d3.axisLeft(this.y);
    this.y_axis.tickFormat((val) => val+""+this.props.config.unit);

    this.line = d3.line()
      .x(d => this.x( new Date(d[0]) ))
      .y(d => this.y( d[1] || 0 ))

    this.svg = d3.select('#'+this.props.name+'-svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var paths = this.svg.append("g");
    this.path = paths.append('path')
      .style('stroke', this.props.config.color(1))
      .style('stroke-width', 2)
      .style('fill', 'none')

  };

  render = ({ name, title, config }) => {
    return (
      <Card style={{"background-color": config.color(.2)}}>
        <Card.Primary style={{"background-color": config.color(.5)}}>
          <Card.Title style={{"color": config.color(0)}}>
            {title}
          </Card.Title>
        </Card.Primary>
        <Card.Media className='card-media' style={{"padding": "0px", "padding-top": "10px"}}>
          <div id={name}>
            <svg id={name+"-svg"}></svg>
          </div>
        </Card.Media>
      </Card>
    );
  }
}
