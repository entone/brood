import { h, Component } from 'preact';
import Match from 'preact-router/match';
import Toolbar from 'preact-material-components/Toolbar';
import Drawer from 'preact-material-components/Drawer';
import List from 'preact-material-components/List';
import 'preact-material-components/Drawer/style.css';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Toolbar/style.css';
import {interpolateGreys} from 'd3-scale-chromatic';
// import style from './style';

export default class Header extends Component {

	constructor(){
    super();
    this.state = {
      drawerOpened: false
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

	render() {
		return (
			<div>
        <Toolbar className="toolbar" fixed={true} style={{"background-color": interpolateGreys(.7)}}>
          <Toolbar.Row>
            <Toolbar.Section align-start={true}>
              <Toolbar.Icon menu={true} onClick={() => {
            		this.setState({
              		drawerOpened: !this.state.drawerOpened
            		})
          		}}>menu</Toolbar.Icon>
              <Toolbar.Title>
                Harvest2o
              </Toolbar.Title>
            </Toolbar.Section>
          </Toolbar.Row>
        </Toolbar>
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
							{this.link("Camera", "timeline", "/camera")}
							{this.link("Settings", "timeline", "/settings")}
						</List>
					</Drawer.DrawerContent>
				</Drawer.TemporaryDrawer>
      </div>
		);
	}
}
