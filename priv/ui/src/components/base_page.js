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
    this.ph = {
      color: cs.interpolatePuBu,
      unit: ""
    }
    this.ec = {
      color: cs.interpolateBuPu,
      unit: "ppm"
    }
    this.doxy = {
      color: cs.interpolateReds,
      unit: "mg/L"
    }
    this.water_level = {
      color: cs.interpolateGnBu,
      unit: "cm"
    }
    this.water_temperature = {
      color: cs.interpolateOrRd,
      unit: "°C"
    }
    this.temperature = {
      color: cs.interpolatePuRd,
      unit: "°C"
    }
    this.humidity = {
      color: cs.interpolateGreys,
      unit: "%"
    }
    this.co2 = {
      color: cs.interpolateYlGnBu,
      unit: "ppm"
    }
    this.pm = {
      color: cs.interpolateBuGn,
      unit: "ppm"
    }
    this.voc = {
      color: cs.interpolateYlGn,
      unit: "ppm"
    }

  }
}
