import { h, Component } from 'preact';
import * as cs  from 'd3-scale-chromatic';

export default class BasePage extends Component {
  constructor() {
    super();
    this.hues = {
      ph: cs.interpolatePuBu,
      ec: cs.interpolateBuPu,
      doxy: cs.interpolateReds,
      water_level: cs.interpolateGnBu,
      water_temperature: cs.interpolateOrRd,
      temperature: cs.interpolatePuRd,
      humidity: cs.interpolateGreys,
      co2: cs.interpolateYlGnBu,
      pm: cs.interpolateBuGn,
      voc: cs.interpolateYlGn,
      control: cs.interpolateRdPu,
      other: cs.interpolatePuBuGn,
      other1: cs.interpolateYlOrBr
    };
  }
}
