import { h, Component } from 'preact';
import { Router, route } from 'preact-router';
import Header from './header';
import Home from '../routes/home';
import Realtime from '../routes/realtime';
import Historic from '../routes/historic';
import Control from '../routes/control';
import Camera from '../routes/camera';
import Settings from '../routes/settings';
import Account from '../routes/account';
import Register from '../routes/register';
import Login from '../routes/login';
import { updateData } from '../actions';
import store from '../store';

class Redirect extends Component {
  componentWillMount() {
    route(this.props.to, true);
  }

  render() {
    return null;
  }
}

const ProtectedRoute = ({ component: Component, ...rest }) => (
  store.getState().is_authenticated
		? (<Component {...rest} />)
		: (<Redirect to='/login' />)
)

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render = () => {
		return (
			<div id="app">
				<Header />
				<Router>
					<ProtectedRoute component={Home} path="/" />
          <ProtectedRoute component={Realtime} path="/realtime" />
          <ProtectedRoute component={Historic} path="/historic" />
          <ProtectedRoute component={Control} path="/control" />
          <ProtectedRoute component={Camera} path="/camera" />
          <ProtectedRoute component={Settings} path="/settings" />
          <ProtectedRoute component={Account} path="/account" />
					<Login path="/login" />
					<Register path="/register" />
				</Router>
			</div>
		);
	}
}
