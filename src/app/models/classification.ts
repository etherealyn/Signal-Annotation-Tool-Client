import { Range } from './range';

export class Classification {
  id: string;
  authorId: string;
  name: string;
  series: Range[] = [];
  buttonChecked = false;

  isLabellingUpdating = false;
  isLabellingStarted = false;

  constructor(id: string, name: string, authorId: string, series: Range[], buttonChecked: boolean = false) {
    this.id = id;
    this.name = name;
    this.authorId = authorId;
    this.series = series;
    this.buttonChecked = buttonChecked;
  }

}
