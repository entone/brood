import {h, Component} from 'preact';
import Slider from 'preact-material-components/Slider';
import 'preact-material-components/Slider/style.css';
import { sendMessage, updateUI } from '../actions';
import store from '../store';

export default class PIDSetpoint extends Component {

  constructor(props){
    super(props);
    this.state = {
      key: props.key,
      multiplier: props.multiplier
    }
  }

  pad = (num) => (
    num <= 9 ? ("0"+num).slice(-2) : num
  )

  onValueChange = (setpoint) => {
    var v = setpoint*this.state.multiplier;
    var ch = Object.assign(this.props, {value: v});
    store.dispatch(sendMessage("setpoint_change", this.state.key, ch));
  }

  onValueInput = (setpoint) => {
    var v = setpoint*this.state.multiplier;
    var ch = Object.assign(this.props, {value: v});
    store.dispatch(sendMessage("setpoint_change", this.state.key, ch, false));
  }

  render = ({ key, value, range, step, locked, multiplier }) => {
    return (
      <div>
        <span className={"setpoint"}>Setpoint: </span><span>{value}</span>
        <Slider disabled={locked} value={value/multiplier} step={step} min={range[0]} max={range[1]} onChange={this.onValueChange} onInput={this.onValueInput} />
      </div>
    );
  }
}
