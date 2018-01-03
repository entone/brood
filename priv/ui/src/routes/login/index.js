import { h, Component } from 'preact';
import { route } from 'preact-router';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import Button from 'preact-material-components/Button';
import TextField from 'preact-material-components/TextField';
import Card from 'preact-material-components/Card';
import 'preact-material-components/LayoutGrid/style.css';
import 'preact-material-components/TextField/style.css';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Card/style.css';
import reduce from '../../reducers';
import store from '../../store';
import * as actions from '../../actions';
import { connect } from 'preact-redux';
import { account } from '../../common/config'
import style from './style';

function login(){
	var fd = new FormData(document.getElementById("login"));
	console.log(fd);
	var h = new Headers();
	fetch(account()+"/account/login", {
		method: "POST",
		body: fd,
		headers: h,
		cors: true,
	}).then((resp) => {
		return resp.json();
	}).then((data) => {
		localStorage.setItem("user", JSON.stringify({token: data.success}));
		store.dispatch(
			actions.authenticated(data.success)
		)
		route("/", true);
	}).catch((error) => {
		console.log(error);
	})
}

@connect(reduce, actions)
export default class Home extends Component {
	submit = (event) => {
		event.preventDefault();
		login();
		return false;
	}

	render = ({ ...state }, { text }) => {
		return (
      <div className="login page">
        <LayoutGrid>
          <LayoutGrid.Inner>
            <LayoutGrid.Cell cols="6" desktopCols="6" tabletCols="8" phoneCols="4">
        			<Card style={{"background-color": "#FFFFFF"}}>
          			<Card.Primary>
            			<Card.Title>Login</Card.Title>
          			</Card.Primary>
          			<Card.Media className='card-media'>
									<form id="login" onsubmit={this.submit}>
										<TextField type="text" name="email" label="Email" fullwidth={true} />
										<TextField type="password" name="password" label="Password" fullwidth={true} />
										<br />
										<Button raised={true}>Login</Button>
									</form>
								</Card.Media>
        			</Card>
            </LayoutGrid.Cell>
          </LayoutGrid.Inner>
        </LayoutGrid>
      </div>
    );
	};
}