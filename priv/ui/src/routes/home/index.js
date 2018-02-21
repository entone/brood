import reduce from '../../reducers';
import * as actions from '../../actions';
import { connect } from 'preact-redux';
import BasePage from '../../components/base_page';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import style from './style';

@connect(reduce, actions)
export default class Home extends BasePage {

	card = (title, list, config, key) => {
		var item = list[list.length-1];
		var val = item ? key ? item.data_point.value[key] : item.data_point.value : 0;
		return (
			<LayoutGrid.Cell cols="3" desktopCols="3" tabletCols="4" phoneCols="4">
				<Card style={{"background-color": config.color(.2)}}>
					<Card.Primary style={{"background-color": config.color(.5)}}>
						<Card.Title style={{"color": config.color(0)}}>
							{title}
						</Card.Title>
					</Card.Primary>
					<Card.Media className='card-media' style={{"padding": "0px", "padding-top": "10px"}}>
						<div style={{color: config.color(.7)}} class="current_value">{val.toFixed(3)}{config.unit}</div>
					</Card.Media>
				</Card>
			</LayoutGrid.Cell>
		)
	}

	render = ({ ...state }, { text }) => {
		return (
      <div className="homepage page" >
        <LayoutGrid>
					<h2>Current Readings</h2>
          <LayoutGrid.Inner>
						{this.card("PH", state.ph, this.ph)}
						{this.card("Eletrical Conductivity", state.ec, this.ec, "tds")}
						{this.card("Water Temperature", state.water_temperature, this.water_temperature)}
						{this.card("Dissolved Oxygen", state.doxy, this.doxy, "mg")}
						{this.card("Water Level", state.water_level, this.water_level)}
						{this.card("Temperature", state.temperature, this.temperature)}
						{this.card("Humidity", state.humidity, this.humidity)}
						{this.card("CO2", state.co2, this.co2)}
						{this.card("Particulate Matter 2.5", state.pm, this.pm)}
						{this.card("Volatile Organic Compounds", state.voc, this.voc)}
          </LayoutGrid.Inner>
        </LayoutGrid>
      </div>
    );
	};
}
