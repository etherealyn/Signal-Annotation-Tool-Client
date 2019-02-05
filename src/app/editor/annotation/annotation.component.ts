import { Component, OnInit } from '@angular/core';
import { VgAPI } from 'videogular2/core';
import { Subscription } from 'rxjs';

class Range {
  startTime: number;
  endTime: number;

  constructor(startTime: number, endTime: number) {
    this.startTime = startTime;
    this.endTime = 0;
  }

  public toString = (): string => {
    return `Range (${this.startTime}, ${this.endTime})`;
  };
}

class Classification {
  name: string;
  series: Range[] = [];
  checked = false;
  finished = false;
}


@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: [ './annotation.component.scss' ]
})
export class AnnotationComponent implements OnInit {

  constructor() {
  }

  private classes: Classification[] = [];

  private _timeUpdateSubscription: Subscription;

  ngOnInit() {
    const labellingClasses = [ 'Aurora', 'Sea', 'Thunder' ];

    this.classes = labellingClasses.map(name => {
      return {
        name: name,
        checked: false,
        finished: false,
        series: []
      };
    });
  }

  startRecording(vgAPI: VgAPI) {
    if (!this._timeUpdateSubscription) {
      this._timeUpdateSubscription = vgAPI.subscriptions.timeUpdate.subscribe((() => {
        this.classes.forEach((classification => {
          const series = classification.series;
          if (classification.checked) {
            if (series.length === 0 || classification.finished) {
              series.push(new Range(vgAPI.currentTime, vgAPI.currentTime));
              classification.finished = false;
            } else {
              series[series.length - 1].endTime = vgAPI.currentTime;
            }
          }
        }));
      }));
    }
  }

  onChange(classification: Classification) {
    const prev = classification.checked;
    classification.checked = !classification.checked;
    if (prev === true && classification.checked === false) {
      classification.finished = true;
    }
  }

  clearLabels() {
    this.classes.forEach(value => {
      value.series = [];
    });
  }
}
