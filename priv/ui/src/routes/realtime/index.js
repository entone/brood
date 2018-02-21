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
            { sensor_card("PH", state.ph, "ph", "ph", this.ph)}
            { sensor_card("Eletrical Conductivity", state.ec, "ec", "tds", this.ec)}
            { sensor_card("Water Temperature", state.water_temperature, "water_temperature", "water_temperature", this.water_temperature)}
            { sensor_card("Dissolved Oxygen", state.doxy, "doxy", "mg", this.doxy)}
            { sensor_card("Water Level", state.water_level, "water_level", "water_level", this.water_level)}
            { sensor_card("Temperature", state.temperature, "temperature", "temperature", this.temperature) }
            { sensor_card("Humidity", state.humidity, "humidity", "humidity", this.humidity) }
						{ sensor_card("CO2", state.co2, "co2", "co2", this.co2) }
            { sensor_card("Particulate Matter 2.5", state.pm, "pm", "pm", this.pm) }
						{ sensor_card("Volatile Organic Compounds", state.voc, "voc", "voc", this.voc) }
          </LayoutGrid.Inner>
        </LayoutGrid>
      </div>
    );
	};
}
