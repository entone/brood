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

	card = (title, list, color, key) => {
		var item = list[list.length-1];
		var val = item ? key ? item.data_point.value[key] : item.data_point.value : 0;
		return (
			<LayoutGrid.Cell cols="3" desktopCols="3" tabletCols="4" phoneCols="4">
				<Card style={{"background-color": color(.2)}}>
					<Card.Primary style={{"background-color": color(.5)}}>
						<Card.Title style={{"color": color(0)}}>
							{title}
						</Card.Title>
					</Card.Primary>
					<Card.Media className='card-media' style={{"padding": "0px", "padding-top": "10px"}}>
						<div style={{color: color(.7)}} class="current_value">{val.toFixed(3)}</div>
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
						{this.card("PH", state.ph, this.hues[0])}
						{this.card("Water Level Lower", state.water_level_lower, this.hues[1])}
						{this.card("Water Level Upper", state.water_level_upper, this.hues[2])}
						{this.card("Humidity", state.humidity, this.hues[3])}
						{this.card("Temperature", state.temperature, this.hues[4])}
						{this.card("Dissolved Oxygen", state.doxy, this.hues[5], "sat")}
						{this.card("EC", state.ec, this.hues[6], "ec")}
          </LayoutGrid.Inner>
        </LayoutGrid>
      </div>
    );
	};
}
