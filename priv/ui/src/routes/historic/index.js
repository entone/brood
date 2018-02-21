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

	constructor(props){
		super(props);
		this.selections = [{bucket: "1m", from: .04}, {bucket: "5m", from: .25}, {bucket: "15m", from: 1}, {bucket: "1h", from: 7}, {bucket: "3h", from: 14}, {bucket: "3h", from: 21}, {bucket: "6h", from: 30}];
		this.state = {
			bucket: "1h",
			from: new Date(Date.now()-((24 * 60 * 60 * 1000))).toISOString(),
			to: "_",
			chosenIndex: 2,
			interval: null,
			interval_time: 30000,
			kit_id: props.kit_id
		}
	}

	update_charts = () => {
		var config = this.selections[this.state.chosenIndex];
		var from = new Date(Date.now()-((config.from * 24 * 60 * 60 * 1000))).toISOString()
		this.setState({
			from: from,
			bucket: config.bucket
		});
		if(this.state.kit_id) this.get_data();
	}

	componentDidMount = ({...state}) => {
		var interval = setInterval( () => this.get_data(),  this.state.interval_time)
		this.setState({
			interval: interval,
			kit_id: state.kit_id
		})
		this.update_charts();
	}

	componentWillUnmount = () => {
		clearInterval(this.state.interval)
	}

	get_data = () => {
		get({kit: this.state.kit_id, aggregator: "mean", measurement: "touchstone.temperature", from: this.state.from , to: this.state.to, bucket: this.state.bucket})
		get({kit: this.state.kit_id, aggregator: "mean", measurement: "touchstone.humidity", from: this.state.from , to: this.state.to, bucket: this.state.bucket})
		get({kit: this.state.kit_id, aggregator: "mean", measurement: "touchstone.co2", from: this.state.from , to: this.state.to, bucket: this.state.bucket})
		get({kit: this.state.kit_id, aggregator: "mean", measurement: "touchstone.pm", from: this.state.from , to: this.state.to, bucket: this.state.bucket})
		get({kit: this.state.kit_id, aggregator: "mean", measurement: "touchstone.voc", from: this.state.from , to: this.state.to, bucket: this.state.bucket})
		get({kit: this.state.kit_id, aggregator: "mean", measurement: "ph", from: this.state.from , to: this.state.to, bucket: this.state.bucket})
		get({kit: this.state.kit_id, aggregator: "mean", measurement: "water_level", from: this.state.from , to: this.state.to, bucket: this.state.bucket})
		get({kit: this.state.kit_id, aggregator: "mean", measurement: "ec.tds", from: this.state.from , to: this.state.to, bucket: this.state.bucket})
		get({kit: this.state.kit_id, aggregator: "mean", measurement: "doxy.mg", from: this.state.from , to: this.state.to, bucket: this.state.bucket})
		get({kit: this.state.kit_id, aggregator: "mean", measurement: "water_temperature", from: this.state.from , to: this.state.to, bucket: this.state.bucket})
		get({kit: this.state.kit_id, aggregator: "mean", measurement: "water_level", from: this.state.from , to: this.state.to, bucket: this.state.bucket})
	}

	render = ({ ...state }, { text }) => {
		if(state.kit_id != this.state.kit_id){
			this.setState({kit_id: state.kit_id});
			this.update_charts();
		}
		return (
      <div className="historic page" >
				<div class="historic-select">
					<span class="pre-text">Past:</span>
					<Select
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
					<span class="post-text">refreshes every 30 seconds</span>
				</div>
        <LayoutGrid>
					<LayoutGrid.Inner>
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<LineGraph name="ph" title="PH" config={this.ph} />
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<LineGraph name="ec_tds" title="Electrical Conductivity" config={this.ec} />
							<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
						</LayoutGrid.Cell>
							<LineGraph name="water_temperature" title="Water Temperature" config={this.water_temperature} />
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<LineGraph name="doxy_mg" title="Dissolved Oxygen" config={this.doxy} />
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<LineGraph name="water_level" title="Water Level" config={this.water_level} />
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<LineGraph name="touchstone_temperature" title="Temperature" config={this.temperature} />
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<LineGraph name="touchstone_humidity" title="Humidity" config={this.humidity} />
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<LineGraph name="touchstone_co2" title="CO2" config={this.co2} />
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<LineGraph name="touchstone_pm" title="Particulate Matter 2.5" config={this.pm} />
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
							<LineGraph name="touchstone_voc" title="Volatile Organic Compounds" config={this.voc} />
						</LayoutGrid.Cell>
          </LayoutGrid.Inner>
        </LayoutGrid>
      </div>
    );
	};
}
