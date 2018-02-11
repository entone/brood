import { h, Component } from 'preact';
import * as cs  from 'd3-scale-chromatic';

export default class BasePage extends Component {
  constructor() {
    super();
    this.hues = [
      cs.interpolatePuBu,
      cs.interpolateBuPu,
      cs.interpolateReds,
      cs.interpolateGnBu,
      cs.interpolateBuGn,
      cs.interpolateOrRd,
      cs.interpolatePuRd,
      cs.interpolateGreys,
      cs.interpolateRdPu,
      cs.interpolatePuBuGn,
    ];
  }
}
