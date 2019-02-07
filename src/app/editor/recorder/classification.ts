import { Range } from './range';

export class Classification {
  name: string;
  series: Range[] = [];
  buttonChecked = false;
  finished = false;
}
