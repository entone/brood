import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import PIDSetpoint from './pid_setpoint';

export default function setpoint(title, key, range, step, color, state, locked, multiplier){
  return (
    <LayoutGrid.Cell cols="6" desktopCols="6" tabletCols="4" phoneCols="4">
      <Card style={{"background-color":color(.2)}}>
        <Card.Primary style={{"background-color":color(.4)}}>
          <Card.Title>
            {title}
          </Card.Title>
        </Card.Primary>
        <Card.Media>
          <PIDSetpoint locked={locked} key={key} value={state[key+"_setpoint"]} range={range} step={step} multiplier={multiplier} />
        </Card.Media>
      </Card>
    </LayoutGrid.Cell>
  );
}
