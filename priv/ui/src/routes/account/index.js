import reduce from '../../reducers';
import * as actions from '../../actions';
import { connect } from 'preact-redux';
import store from '../../store';
import BasePage from '../../components/base_page';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import TextField from 'preact-material-components/TextField';
import 'preact-material-components/TextField/style.css';

import { account } from '../../common/config'
import style from './style';

function add_kit(){
	var fd = new FormData(document.getElementById("new_kit"));
	fetch(account()+"/account/add_kit", {
		method: "POST",
		body: fd,
		cors: true,
		headers: {
			"authorization": authorize(),
		},
	}).then((resp) => {
		return resp.json();
	}).then((data) => {
		store.dispatch(
			actions.kitAdded(data)
		)
	}).catch((error) => {
		console.log(error);
	})
}

function authorize(){
  var user = localStorage.getItem('user');
  if(user) return "Bearer " + JSON.parse(user).token;
  return false;
}

@connect(reduce, actions)
export default class Account extends BasePage {

	add = (event) => {
		event.preventDefault();
		add_kit();
		return false;
	}

	render = ({...state}) => (
		<div className="account page">
			<LayoutGrid>
				<LayoutGrid.Inner>
					{state.kits.map((kit, i) => (
						<LayoutGrid.Cell cols="3" desktopCols="3" tabletCols="4" phoneCols="4">
							<Card style={{"background-color": this.hues.ph(.2)}}>
								<Card.Primary style={{"background-color": this.hues.ph(.5)}}>
									<Card.Title style={{"color": this.hues.ph(0)}}>
										{kit.name}
										</Card.Title>
								</Card.Primary>
							</Card>
						</LayoutGrid.Cell>
					))}
					<LayoutGrid.Cell cols="3" desktopCols="3" tabletCols="4" phoneCols="4">
						<Card style={{"background-color": this.hues.ph(.2)}}>
							<Card.Primary style={{"background-color": this.hues.ph(.5)}}>
								<Card.Title style={{"color": this.hues.ph(0)}}>
									Add New
									</Card.Title>
							</Card.Primary>
							<Card.Media>
								<form id="new_kit" onsubmit={this.add}>
									<TextField type="text" name="location_name" placeholder="Name" fullwidth={true} />
									<TextField type="text" name="kit_id" placeholder="ID" fullwidth={true}/>
									<br />
									<Button raised={true}>Add</Button>
								</form>
							</Card.Media>
						</Card>
					</LayoutGrid.Cell>
				</LayoutGrid.Inner>
			</LayoutGrid>
		</div>
	)
}
