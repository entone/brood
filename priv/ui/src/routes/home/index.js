import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import Elevation from 'preact-material-components/Elevation';
import 'preact-material-components/Elevation/style.css';
import reduce from '../../reducers';
import * as actions from '../../actions';
import Actuator from '../../components/actuator';
import Sensor from '../../components/sensor';
import { connect } from 'preact-redux';
import * as cs  from 'd3-scale-chromatic';
import TimePicker from '../../components/time_picker';
import style from './style';

@connect(reduce, actions)
export default class Home extends Component {
  constructor() {
    super();
    this.hues = [
      cs.interpolatePuBu,
      cs.interpolateBuPu,
      cs.interpolateReds,
      cs.interpolateGnBu,
      cs.interpolateBuGn,
      cs.interpolateOrRd,
      cs.interpolatePuRd,
      cs.interpolateGreys,
      cs.interpolateRdPu,
      cs.interpolatePuBuGn,
    ];
  }
  sensor_card = (title, list, name, graph_var, color) => {
    return (
      <LayoutGrid.Cell cols="3" desktopCols="3" tabletCols="4" phoneCols="4">
        <Sensor list={list} title={title} name={name} color={color} graph_var={graph_var} />
      </LayoutGrid.Cell>
    )
  };

  actuator_card = (title, value, name, color) => {
    return (
      <LayoutGrid.Cell cols="2" desktopCols="2" tabletCols="2" phoneCols="2">
        <Actuator title={title} value={value} name={name} color={color} />
      </LayoutGrid.Cell>
    )
  };

  actuator_group = (title, name, color, state) => (
    <LayoutGrid.Cell cols="3" desktopCols="3" tabletCols="2" phoneCols="4">
      <Elevation z={6}>
        <Card style={{"background-color":color(.2)}}>
          <Card.Primary style={{"background-color":color(.4)}}>
            <Card.Title>
              {title}
            </Card.Title>
          </Card.Primary>
          <Card.Media>
            <LayoutGrid.Cell cols="4" desktopCols="4" tabletCols="2" phoneCols="4">
              { this.actuator_card("Upper", state[name+"_upper"], name+"_upper", color)}
              { this.actuator_card("Lower", state[name+"_lower"], name+"_lower", color)}
            </LayoutGrid.Cell>
          </Card.Media>
        </Card>
      </Elevation>
    </LayoutGrid.Cell>
  );

  camera = (color, state) => (
    <LayoutGrid.Cell cols="3" desktopCols="3" tabletCols="2" phoneCols="4">
      <Elevation z={6}>
        <Card style={{"background-color":color(.2)}}>
          <Card.Primary style={{"background-color":color(.4)}}>
            <Card.Title>
              Camera
            </Card.Title>
          </Card.Primary>
          <Card.Media className="image">
            <img className="camera-image" src={"data:image/png;base64," + window.btoa(state.image)} />
          </Card.Media>
        </Card>
      </Elevation>
    </LayoutGrid.Cell>
  )

  time = (title, key, color, state) => (
    <LayoutGrid.Cell cols="2" desktopCols="2" tabletCols="2" phoneCols="2">
      <Card style={{"background-color":color(.2)}}>
        <Card.Primary style={{"background-color":color(.4)}}>
          <Card.Title>
            {title}
          </Card.Title>
        </Card.Primary>
        <Card.Media>
          <TimePicker start={state[key+"_start"]} run_time={state[key+"_run_time"]} key={key} />
        </Card.Media>
      </Card>
    </LayoutGrid.Cell>
  )

	render = ({ ...state }, { text }) => {
		return (
      <div className="homepage page" >
        <LayoutGrid>
          <LayoutGrid.Inner>
            { this.sensor_card("EC", state.ec, "ec", "ec", this.hues[4])}
            { this.sensor_card("PH", state.ph, "ph", "ph", this.hues[5])}
            { this.sensor_card("Water Temperature", state.water_temperature, "water_temperature", "water_temperature", this.hues[6])}
            { this.sensor_card("DO", state.doxy, "doxy", "mg", this.hues[9])}
            { this.sensor_card("Water Level Upper", state.water_level_upper, "water_level_upper", "water_level_upper", this.hues[0])}
            { this.sensor_card("Water Level Lower", state.water_level_lower, "water_level_lower", "water_level_lower", this.hues[1])}
            { this.sensor_card("Temperature", state.temperature, "temperature", "temperature", this.hues[2]) }
            { this.sensor_card("Humidity", state.humidity, "humidity", "humidity", this.hues[3]) }
            { this.camera(this.hues[7], state) }
            { this.actuator_group("Pumps", "pump", this.hues[7], state)}
            { this.actuator_group("Lights", "light", this.hues[7], state)}
            { this.actuator_group("Dose", "dose", this.hues[7], state)}
            { this.time("Upper Lights", "light_upper", this.hues[8], state) }
            { this.time("Lower Lights", "light_lower", this.hues[8], state) }
          </LayoutGrid.Inner>
        </LayoutGrid>
      </div>
    );
	};
}
