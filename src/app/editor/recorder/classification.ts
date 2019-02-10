import { Range } from './range';

export class Classification {
  name: string;
  series: Range[] = [];
  buttonChecked = false;
  finished = false;

  constructor(name: string, series: Range[], buttonChecked: boolean = false, finished: boolean = false) {
    this.name = name;
    this.series = series;
    this.buttonChecked = buttonChecked;
    this.finished = finished;
  }

}
