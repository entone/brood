import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import Elevation from 'preact-material-components/Elevation';
import 'preact-material-components/Elevation/style.css';
import Actuator from './actuator';

export default function actuator_group(title, name, color, state){
  return (
    <LayoutGrid.Cell cols="6" desktopCols="6" tabletCols="4" phoneCols="4">
      <Elevation z={6}>
        <Card style={{"background-color":color(.2)}}>
          <Card.Primary style={{"background-color":color(.4)}}>
            <Card.Title>
              {title}
            </Card.Title>
          </Card.Primary>
          <Card.Media>
            <LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
              { actuator_card("Upper", state[name+"_upper"], name+"_upper", color)}
              { actuator_card("Lower", state[name+"_lower"], name+"_lower", color)}
            </LayoutGrid.Cell>
          </Card.Media>
        </Card>
      </Elevation>
    </LayoutGrid.Cell>
  );
};

function actuator_card(title, value, name, color){
  return (
    <LayoutGrid.Cell cols="6" desktopCols="6" tabletCols="4" phoneCols="4">
      <Actuator title={title} value={value} name={name} color={color} />
    </LayoutGrid.Cell>
  )
}
