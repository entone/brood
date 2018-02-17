import reduce from '../../reducers';
import * as actions from '../../actions';
import { connect } from 'preact-redux';
import BasePage from '../../components/base_page';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import actuator_group from '../../components/actuator_group';
import style from './style';

@connect(reduce, actions)
export default class Control extends BasePage {

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
      <div className="control page" >
        <LayoutGrid>
          <LayoutGrid.Inner>
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<Button raised onClick={ () => this.toggle() } >{this.state.locked ? "Unlock" : "Lock"}</Button>
						</LayoutGrid.Cell>
						{ actuator_group("Light", "light", this.hues.control, state, this.state.locked)}
            { actuator_group("CO2 Dispenser", "co2_dispenser", this.hues.control, state, this.state.locked)}
            { actuator_group("Dehumidifier", "dehumidifier", this.hues.control, state, this.state.locked)}
            { actuator_group("Chill Box", "chill_box", this.hues.control, state, this.state.locked)}
						{ actuator_group("Chill Fan", "chill_fan", this.hues.control, state, this.state.locked)}
						{ actuator_group("PH Dose", "ph_dose", this.hues.control, state, this.state.locked)}
						{ actuator_group("Nute Dose", "nute_dose", this.hues.control, state, this.state.locked)}
          </LayoutGrid.Inner>
        </LayoutGrid>
      </div>
    );
	};
}
