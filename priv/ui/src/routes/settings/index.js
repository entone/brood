import reduce from '../../reducers';
import * as actions from '../../actions';
import { connect } from 'preact-redux';
import BasePage from '../../components/base_page';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import time from '../../components/time';
import setpoint from '../../components/setpoint';
import style from './style';

@connect(reduce, actions)
export default class Settings extends BasePage {

	constructor(props){
		super(props);
		this.state = {
			locked: true
		}
	}

	toggle = () => {
		this.setState({
			locked: !this.state.locked
		})
	}

	render = ({ ...state }, { text }) => {
		return (
      <div className="settings page" >
        <LayoutGrid>
          <LayoutGrid.Inner>
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<Button raised onClick={ () => this.toggle() } >{this.state.locked ? "Unlock" : "Lock"}</Button>
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<h2>Lighting</h2>
						</LayoutGrid.Cell>
            { time("Lights", "light", this.hues.other, state, this.state.locked) }
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<h2>Water Quality</h2>
						</LayoutGrid.Cell>
						{ setpoint("PH", "ph", [5, 8], .1, this.hues.other, state, this.state.locked, 1) }
						{ setpoint("Nutes", "nute", [1, 5], .1, this.hues.other, state, this.state.locked, 1) }
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<h2>Environmentals <span className="h2_post">Night and day settings are based on the lighting settings</span></h2>
						</LayoutGrid.Cell>
						{ setpoint("Nighttime Temperature", "night_temp", [20, 35], 1, this.hues.other, state, this.state.locked, 1) }
						{ setpoint("Daytime Temperature", "day_temp", [20, 35], 1, this.hues.other1, state, this.state.locked, 1) }
						{ setpoint("Nighttime Humidity", "night_humidity", [10, 90], 1, this.hues.other, state, this.state.locked, 1) }
						{ setpoint("Daytime Humidity", "day_humidity", [10, 90], 1, this.hues.other1, state, this.state.locked, 1) }
						{ setpoint("Nighttime CO2", "night_co2", [4, 30], 1, this.hues.other, state, this.state.locked, 100) }
						{ setpoint("Daytime CO2", "day_co2", [4, 30], 1, this.hues.other1, state, this.state.locked, 100) }
          </LayoutGrid.Inner>
        </LayoutGrid>
      </div>
    );
	};
}
