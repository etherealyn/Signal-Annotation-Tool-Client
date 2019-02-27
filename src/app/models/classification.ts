import { Range } from './range';

export class Classification {
  id: string;
  name: string;
  series: Range[] = [];
  buttonChecked = false;
  finished = false;

  constructor(id: string, name: string, series: Range[], buttonChecked: boolean = false, finished: boolean = false) {
    this.id = id;
    this.name = name;
    this.series = series;
    this.buttonChecked = buttonChecked;
    this.finished = finished;
  }

}
