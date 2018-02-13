import { h, Component } from 'preact';
import * as cs  from 'd3-scale-chromatic';

export default class BasePage extends Component {
  constructor() {
    super();
    this.hues = {
      ph: cs.interpolatePuBu,
      ec: cs.interpolateBuPu,
      doxy: cs.interpolateReds,
      water_level_lower: cs.interpolateGnBu,
      water_level_upper: cs.interpolateBuGn,
      water_temperature: cs.interpolateOrRd,
      temperature: cs.interpolatePuRd,
      humidity: cs.interpolateGreys,
      control: cs.interpolateRdPu,
      other: cs.interpolatePuBuGn,
    };
  }
}
