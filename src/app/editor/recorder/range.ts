export class Range {
  startTime: number;
  endTime: number;

  constructor(startTime: number, endTime: number) {
    this.startTime = startTime;
    this.endTime = endTime;
  }

  public toString = (): string => {
    return `Range (${this.startTime}, ${this.endTime})`;
  };
}
