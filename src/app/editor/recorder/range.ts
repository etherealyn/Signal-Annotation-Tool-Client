export class Range {
  id: number;
  startTime: number;
  endTime: number;

  constructor(id: number, startTime: number, endTime: number) {
    this.id = id;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  public toString = (): string => {
    return `Range (${this.startTime}, ${this.endTime})`;
  };
}
