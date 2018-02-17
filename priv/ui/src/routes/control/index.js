import reduce from '../../reducers';
import * as actions from '../../actions';
import { connect } from 'preact-redux';
import BasePage from '../../components/base_page';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import actuator_group from '../../components/actuator_group';
import style from './style';

@connect(reduce, actions)
export default class Control extends BasePage {

	render = ({ ...state }, { text }) => {
		return (
      <div className="control page" >
        <LayoutGrid>
          <LayoutGrid.Inner>
						{ actuator_group("Light", "light", this.hues.control, state)}
            { actuator_group("CO2 Dispenser", "co2_dispenser", this.hues.control, state)}
            { actuator_group("Dehumidifier", "dehumidifier", this.hues.control, state)}
            { actuator_group("Chill Box", "chill_box", this.hues.control, state)}
						{ actuator_group("Chill Fan", "chill_fan", this.hues.control, state)}
						{ actuator_group("PH Dose", "ph_dose", this.hues.control, state)}
						{ actuator_group("Nute Dose", "nute_dose", this.hues.control, state)}
          </LayoutGrid.Inner>
        </LayoutGrid>
      </div>
    );
	};
}
