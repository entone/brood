import {h, Component} from 'preact';
import Select from 'preact-material-components/Select';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Menu/style.css';
import 'preact-material-components/Select/style.css';
import Slider from 'preact-material-components/Slider';
import 'preact-material-components/Slider/style.css';

export default class TimePicker extends Component {

  shouldComponentUpdate = (e) => (true);

  constructor(props){
    super(props);
    this.state = {
      start: this.props.start,
      run_time: this.props.run_time,
    }
  }

  pad = (num) => (
    num <= 9 ? ("0"+num).slice(-2) : num
  )

  onStartChange = (time) => {
    this.setState({
      start: time,
    });
    this.props.onChange(this.state);
  }

  onStartInput = (time) => {
    this.setState({
      start: time
    })
  }

  onRunChange = (time) => {
    this.setState({
      run_time: time
    })
    this.props.onChange(this.state);
  }

  onRunInput = (time) => {
    this.setState({
      run_time: time
    })
  }

  render = ({ start, run_time, onChange }) => {
    return (
      <div>
        <span className={"start_at"}>Start at: </span><span>{this.pad(Math.floor(this.state.start/60))+":"+this.pad(this.state.start%60)}</span>
        <Slider step={15} value={this.state.start} max={1440} onChange={this.onStartChange} onInput={this.onStartInput} />
        <br />
        <br />
        <span className={"run_for"}>Run For: </span><span>{this.pad(Math.floor(this.state.run_time/60))+":"+this.pad(this.state.run_time%60)} hours</span>
        <Slider step={15} value={this.state.run_time} max={1440} onChange={this.onRunChange} onInput={this.onRunInput} />
      </div>
    );
  }
}
