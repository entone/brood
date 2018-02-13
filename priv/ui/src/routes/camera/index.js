import reduce from '../../reducers';
import * as actions from '../../actions';
import { connect } from 'preact-redux';
import BasePage from '../../components/base_page';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import camera from '../../components/camera';
import style from './style';

@connect(reduce, actions)
export default class Camera extends BasePage {

	render = ({ ...state }, { text }) => {
		return (
      <div className="camera page" >
        <LayoutGrid>
          <LayoutGrid.Inner>
            { camera(this.hues.other, state) }
          </LayoutGrid.Inner>
        </LayoutGrid>
      </div>
    );
	};
}
