import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import Elevation from 'preact-material-components/Elevation';

export default function camera(color, state){
  return (
    <LayoutGrid.Cell cols="12" desktopCols="12" tabletCols="8" phoneCols="4">
      <Elevation z={6}>
        <Card style={{"background-color":color(.2)}}>
          <Card.Primary style={{"background-color":color(.4)}}>
            <Card.Title>
              Camera
            </Card.Title>
          </Card.Primary>
          <Card.Media className="image">
            <img className="camera-image" src={"data:image/png;base64," + window.btoa(state.image)} />
          </Card.Media>
        </Card>
      </Elevation>
    </LayoutGrid.Cell>
  );
}
