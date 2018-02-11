import reduce from '../../reducers';
import * as actions from '../../actions';
import { connect } from 'preact-redux';
import BasePage from '../../components/base_page';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import time from '../../components/time';
import style from './style';

@connect(reduce, actions)
export default class Settings extends BasePage {

	render = ({ ...state }, { text }) => {
		return (
      <div className="settings page" >
        <LayoutGrid>
          <LayoutGrid.Inner>
            { time("Upper Lights", "light_upper", this.hues[8], state) }
            { time("Lower Lights", "light_lower", this.hues[8], state) }
          </LayoutGrid.Inner>
        </LayoutGrid>
      </div>
    );
	};
}
