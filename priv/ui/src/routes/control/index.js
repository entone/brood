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
            { actuator_group("Pumps", "pump", this.hues.control, state)}
            { actuator_group("Lights", "light", this.hues.control, state)}
            { actuator_group("Dose", "dose", this.hues.control, state)}
          </LayoutGrid.Inner>
        </LayoutGrid>
      </div>
    );
	};
}
