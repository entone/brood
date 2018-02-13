import reduce from '../../reducers';
import * as actions from '../../actions';
import { connect } from 'preact-redux';
import BasePage from '../../components/base_page';
import LineGraph from '../../components/line_graph';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import Select from 'preact-material-components/Select';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Menu/style.css';
import 'preact-material-components/Select/style.css';
import { get } from '../../util/data_api';
import style from './style';

@connect(reduce, actions)
export default class Historic extends BasePage {

	constructor(){
		super();
		this.selections = [{bucket: "1m", from: .04}, {bucket: "5m", from: .25}, {bucket: "15m", from: 1}, {bucket: "1h", from: 7}, {bucket: "3h", from: 14}, {bucket: "3h", from: 21}, {bucket: "6h", from: 30}];
		this.state = {
			bucket: "1h",
			from: new Date(Date.now()-((24 * 60 * 60 * 1000))).toISOString(),
			to: "_",
			update: false,
			chosenIndex: 2,
			interval: null,
			interval_time: 30000
		}
	}

	update_charts = () => {
		var config = this.selections[this.state.chosenIndex];
		var from = new Date(Date.now()-((config.from * 24 * 60 * 60 * 1000))).toISOString()
		this.setState({
			update: true,
			from: from,
			bucket: config.bucket
		});
		this.get_data();
	}

	shouldComponentUpdate = () => {
		if(this.state.update){
			this.setState({update: false})
			return true;
		}
		return false;
	}

	componentDidMount = () => {
		this.update_charts();
		var interval = setInterval( () => this.get_data(),  this.state.interval_time)
		this.setState({
			interval: interval
		})
	}

	componentWillUnmount = () => {
		clearInterval(this.state.interval)
	}

	get_data = () => {
		get({aggregator: "mean", measurement: "ph", from: this.state.from , to: this.state.to, bucket: this.state.bucket})
		get({aggregator: "mean", measurement: "water_level_lower", from: this.state.from , to: this.state.to, bucket: this.state.bucket})
		get({aggregator: "mean", measurement: "water_level_upper", from: this.state.from , to: this.state.to, bucket: this.state.bucket})
		get({aggregator: "mean", measurement: "ec.ec", from: this.state.from , to: this.state.to, bucket: this.state.bucket})
		get({aggregator: "mean", measurement: "doxy.sat", from: this.state.from , to: this.state.to, bucket: this.state.bucket})
		get({aggregator: "mean", measurement: "water_temperature", from: this.state.from , to: this.state.to, bucket: this.state.bucket})
		get({aggregator: "mean", measurement: "temperature", from: this.state.from , to: this.state.to, bucket: this.state.bucket})
		get({aggregator: "mean", measurement: "humidity", from: this.state.from , to: this.state.to, bucket: this.state.bucket})
	}

	render = ({ ...state }, { text }) => {
		return (
      <div className="historic page" >
				<Select hintText="Past" id="time_selector"
					selectedIndex={this.state.chosenIndex}
					onChange={(e)=>{
						this.setState({
							chosenIndex: e.selectedIndex
						});
						this.update_charts();
					}}>
						<Select.Item>Hour</Select.Item>
						<Select.Item>6 Hours</Select.Item>
						<Select.Item>Day</Select.Item>
						<Select.Item>Week</Select.Item>
						<Select.Item>2 Weeks</Select.Item>
						<Select.Item>3 Weeks</Select.Item>
						<Select.Item>Month</Select.Item>
				</Select>
				&nbsp;&nbsp;refreshes every 30 seconds
        <LayoutGrid>
          <LayoutGrid.Inner>
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<LineGraph name="ph" title="PH" color={this.hues.ph} />
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<LineGraph name="water_level_lower" title="Water Level Lower" color={this.hues.water_level_lower} />
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<LineGraph name="water_level_upper" title="Water Level Upper" color={this.hues.water_level_upper} />
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<LineGraph name="humidity" title="Humidity" color={this.hues.humidity} />
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<LineGraph name="temperature" title="Temperature" color={this.hues.temperature} />
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<LineGraph name="doxy_sat" title="Dissolved Oxygen" color={this.hues.doxy} />
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<LineGraph name="ec_ec" title="EC" color={this.hues.ec} />
						</LayoutGrid.Cell>
          </LayoutGrid.Inner>
        </LayoutGrid>
      </div>
    );
	};
}
