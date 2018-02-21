import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import Sensor from './sensor';

export default function sensor_card(title, list, name, graph_var, config){
  return (
    <LayoutGrid.Cell cols="4" desktopCols="4" tabletCols="4" phoneCols="4">
      <Sensor list={list} title={title} name={name} config={config} graph_var={graph_var} />
    </LayoutGrid.Cell>
  )
}
