import reduce from '../../reducers';
import * as actions from '../../actions';
import { connect } from 'preact-redux';
import BasePage from '../../components/base_page';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import sensor_card from '../../components/sensor_card';
import style from './style';

@connect(reduce, actions)
export default class Realtime extends BasePage {

	render = ({ ...state }, { text }) => {
		return (
      <div className="realtime page" >
        <LayoutGrid>
          <LayoutGrid.Inner>
            { sensor_card("PH", state.ph, "ph", "ph", this.hues[5])}
            { sensor_card("EC", state.ec, "ec", "ec", this.hues[4])}
            { sensor_card("Water Temperature", state.water_temperature, "water_temperature", "water_temperature", this.hues[6])}
            { sensor_card("DO", state.doxy, "doxy", "mg", this.hues[9])}
            { sensor_card("Water Level Upper", state.water_level_upper, "water_level_upper", "water_level_upper", this.hues[0])}
            { sensor_card("Water Level Lower", state.water_level_lower, "water_level_lower", "water_level_lower", this.hues[1])}
            { sensor_card("Temperature", state.temperature, "temperature", "temperature", this.hues[2]) }
            { sensor_card("Humidity", state.humidity, "humidity", "humidity", this.hues[3]) }
          </LayoutGrid.Inner>
        </LayoutGrid>
      </div>
    );
	};
}
