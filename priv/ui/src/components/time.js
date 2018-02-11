import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import TimePicker from './time_picker';

export default function time(title, key, color, state){
  return (
    <LayoutGrid.Cell cols="6" desktopCols="6" tabletCols="4" phoneCols="4">
      <Card style={{"background-color":color(.2)}}>
        <Card.Primary style={{"background-color":color(.4)}}>
          <Card.Title>
            {title}
          </Card.Title>
        </Card.Primary>
        <Card.Media>
          <TimePicker start={state[key+"_start"]} run_time={state[key+"_run_time"]} key={key} />
        </Card.Media>
      </Card>
    </LayoutGrid.Cell>
  );
}
