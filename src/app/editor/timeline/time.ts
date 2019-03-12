import * as moment from 'moment';

export class Time {
  static seconds(second: number): number {
    return second * 1000;
  }

  static dateToSeconds(t: Date) {
    const time = moment(t).utc();
    return time.seconds() + time.minutes() * 60 + time.hours() * 360 + time.milliseconds() / 1000;
  }
}
