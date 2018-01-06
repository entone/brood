import { h, Component } from 'preact';
import * as d3 from 'd3';
import { connect } from 'preact-redux';
import * as actions from '../actions';
import reduce from '../reducers';
import { num_data_points } from '../common/config'

@connect(reduce, actions)
export default class RealtimeGraph extends Component {

  shouldComponentUpdate = ({...state}) => {
    var data = state[this.props.name]
    var maxv = d3.max(data, (d) => {
      return typeof d.data_point.value == "object" ? d.data_point.value[this.props.graph_var] : d.data_point.value
    });
    this.y.domain([maxv/2, maxv]);
    for (var name in this.groups) {
      var group = this.groups[name]
      group.path.data([state[this.props.name]]).attr('d', this.line)
    }
    return false;
  }

  componentDidMount = ({...state}) => {
    this.groups = {
      current: {
        value: 0,
        color: this.props.color(1),
        data: this.props.list
      }
    };
    this.width = document.getElementById(this.props.name).clientWidth;
    var limit = 60 * 1,
      duration = 750,
      now = new Date(Date.now() - duration)
    var width = this.width;
    var height = 20;

    this.x = d3.scaleLinear()
      .domain([0, num_data_points])
      .range([0, width]);

    this.y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0])

    this.line = d3.line()
      .x((d, i) => {
        return this.x(i)
      })
      .y((d) => {
        var v = typeof d.data_point.value == "object" ? d.data_point.value[this.props.graph_var] : d.data_point.value
        return this.y(v);
      })

    var svg = d3.select('#'+this.props.name+'-svg')
      .attr('class', 'chart')
      .attr('width', width)
      .attr('height', height + 35)

    //var x_axis = d3.axisBottom(this.x)
    //  .ticks(5);

    //var axis = svg.append('g')
    //  .attr('class', 'x axis')
    //  .attr('transform', 'translate(0,' + height + ')')
    //  .call(x_axis);

    var paths = svg.append('g');

    for (var name in this.groups) {
      var group = this.groups[name];
      group.path = paths.append('path')
        .attr('class', name + ' group')
        .style('stroke', group.color)
        .style('fill', 'none')
    }
  };

  render = ({list, name, graph_var, color}) => {
    return (
      <svg id={name+"-svg"}></svg>
    );
  }
}
