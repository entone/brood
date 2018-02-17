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
            { sensor_card("PH", state.ph, "ph", "ph", this.hues.ph)}
            { sensor_card("EC", state.ec, "ec", "ec", this.hues.ec)}
            { sensor_card("Water Temperature", state.water_temperature, "water_temperature", "water_temperature", this.hues.water_temperature)}
            { sensor_card("DO", state.doxy, "doxy", "mg", this.hues.doxy)}
            { sensor_card("Water Level", state.water_level, "water_level", "water_level", this.hues.water_level)}
            { sensor_card("Temperature", state.temperature, "temperature", "temperature", this.hues.temperature) }
            { sensor_card("Humidity", state.humidity, "humidity", "humidity", this.hues.humidity) }
						{ sensor_card("CO2", state.co2, "co2", "co2", this.hues.co2) }
            { sensor_card("PM", state.pm, "pm", "pm", this.hues.pm) }
						{ sensor_card("VOC", state.voc, "voc", "voc", this.hues.voc) }
          </LayoutGrid.Inner>
        </LayoutGrid>
      </div>
    );
	};
}
