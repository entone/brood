import {h, Component} from 'preact';
import Select from 'preact-material-components/Select';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Menu/style.css';
import 'preact-material-components/Select/style.css';
import Slider from 'preact-material-components/Slider';
import 'preact-material-components/Slider/style.css';
import { sendMessage, updateUI } from '../actions';
import store from '../store';

export default class TimePicker extends Component {

  //shouldComponentUpdate = (e) => (!this.state.dragging);

  constructor(props){
    super(props);
    this.state = {
      key: this.props.key,
      start: this.props.start,
      run_time: this.props.run_time,
      dragging: false
    }
  }

  pad = (num) => (
    num <= 9 ? ("0"+num).slice(-2) : num
  )

  onStartChange = (time) => {
    this.setState({
      start: time,
      dragging: false
    });
    store.dispatch(sendMessage("time_change", this.state.key, this.state));
  }

  onStartInput = (time) => {
    this.setState({
      start: time,
      dragging: true
    })
    store.dispatch(sendMessage("time_change", this.state.key, this.state, false));
  }

  onRunChange = (time) => {
    this.setState({
      run_time: time,
      dragging: false
    })
    store.dispatch(sendMessage("time_change", this.state.key, this.state));
  }

  onRunInput = (time) => {
    this.setState({
      run_time: time,
      dragging: true
    })
    store.dispatch(sendMessage("time_change", this.state.key, this.state, false));
  }

  render = ({ key, start, run_time }) => {
    if(start.constructor === Array) start = (start[0]*60)+start[1];
    return (
      <div>
        <span className={"start_at"}>Start at: </span><span>{this.pad(Math.floor(start/60))+":"+this.pad(start%60)}</span>
        <Slider step={15} value={start} max={1440} onChange={this.onStartChange} onInput={this.onStartInput} />
        <br />
        <br />
        <span className={"run_for"}>Run For: </span><span>{this.pad(Math.floor(run_time/60))+":"+this.pad(run_time%60)} hours</span>
        <Slider step={15} value={run_time} max={1440} onChange={this.onRunChange} onInput={this.onRunInput} />
      </div>
    );
  }
}
