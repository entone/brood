import { h, Component } from 'preact';
import Match from 'preact-router/match';
import Toolbar from 'preact-material-components/Toolbar';
import Drawer from 'preact-material-components/Drawer';
import List from 'preact-material-components/List';
import 'preact-material-components/Drawer/style.css';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Toolbar/style.css';
import Select from 'preact-material-components/Select';
import 'preact-material-components/Menu/style.css';
import 'preact-material-components/Select/style.css';
import {interpolateGreys} from 'd3-scale-chromatic';
import reduce from '../../reducers';
import * as actions from '../../actions';
import { route } from 'preact-router';
import store from '../../store';
import { connect } from 'preact-redux';
// import style from './style';

@connect(reduce, actions)
export default class Header extends Component {
	constructor(props){
    super(props);
    this.state = {
      drawerOpened: false,
			chosenKit: 0,
			kits: []
    };
  }

	link = (text, icon, path) => (
		<Match path={path}>
			{ ({matches}) => (
				<List.LinkItem className={matches && "mdc-list-item--activated"} onClick={ () => {this.setState({drawerOpened: false})} } href={path}>
					<List.ItemIcon>{icon}</List.ItemIcon>{text}
				</List.LinkItem>
			)}
		</Match>
	)

	logout = (text, icon, path) => (
		<List.LinkItem onClick={
			(e) => {
				e.stopPropagation();
				e.preventDefault();
				this.setState({
					drawerOpened: false
				});
				localStorage.removeItem("user");
				store.dispatch(actions.logout());
				location.reload();
			}
		} href={path}>
			<List.ItemIcon>{icon}</List.ItemIcon>{text}
		</List.LinkItem>
	)

	get_selected_index = (state) => {
		return state.kits.findIndex( (kit) => kit.id == state.kit_id );
	}

	kit = (state) => {
		if(state.is_authenticated){
			return (
				<div>
					<Select hintText={"Grow System"}
						selectedIndex={this.state.chosenKit}
						onChange={ (e)=> {
							this.setState({
								chosenKit: e.selectedIndex
							});
							store.dispatch(
								actions.changeKit(e.selectedOptions[0].value)
							);
						}}>
						{state.kits.map((kit, i) => (
							<Select.Item value={kit.id}>{kit.name}</Select.Item>
						))}
					</Select>
				</div>
			)
		}else{
			return (<div></div>);
		}
	}

	drawer = (state) => {
		if(state.is_authenticated){
			return (
				<Drawer.TemporaryDrawer open={this.state.drawerOpened} onClose={() => {
					this.setState({
						drawerOpened: false
					});
				}}>
					<Drawer.DrawerContent>
						<List>
							{this.link("Home", "home", "/")}
							{this.link("Realtime Data", "timeline", "/realtime")}
							{this.link("Historic Data", "history", "/historic")}
							{this.link("Override", "control_point", "/control")}
							{this.link("Camera", "camera", "/camera")}
							{this.link("Settings", "timeline", "/settings")}
							{this.link("Account", "account_box", "/account")}
							{this.logout("Logout", "exit_to_app", "/logout")}
						</List>
					</Drawer.DrawerContent>
				</Drawer.TemporaryDrawer>
			);
		}else{
			return (<div></div>);
		}
	}

	render({...state}) {
		return (
			<div>
        <Toolbar className="toolbar" fixed={true} style={{"background-color": interpolateGreys(.7)}}>
          <Toolbar.Row>
            <Toolbar.Section align-start={true}>
              <Toolbar.Icon menu={state.is_authenticated} onClick={() => {
            		this.setState({
              		drawerOpened: !this.state.drawerOpened
            		})
          		}}>{state.is_authenticated ? "menu" : ""}</Toolbar.Icon>
              <Toolbar.Title>
                Harvest2o
              </Toolbar.Title>
            </Toolbar.Section>
						<Toolbar.Section align-end={true}>
							{ this.kit(state) }
						</Toolbar.Section>
          </Toolbar.Row>
        </Toolbar>
				{ this.drawer(state) }
      </div>
		);
	}
}
