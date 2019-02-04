import { Component, Input, OnInit } from '@angular/core';
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
  }
}

class Classification {
  name: string;
  series: Range[] = [];
  checked = false;
  isBeingLabelled = false;
}


@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: [ './annotation.component.scss' ]
})
export class AnnotationComponent implements OnInit {

  constructor() {
  }

  timerHandle: number;

  classes: Classification[] = [
    {
      name: 'Северное сияние',
      checked: false,
      isBeingLabelled: false,
      series: []
    },
    {
      name: 'Море',
      checked: false,
      isBeingLabelled: false,
      series: []
    },
    {
      name: 'Облака',
      checked: false,
      isBeingLabelled: false,
      series: []
    }
  ];

  private _timeUpdateSubscription: Subscription;
  debug = JSON.stringify(this.classes);

  ngOnInit() {
  }

  startRecording(vgAPI: VgAPI) {
    if (!this._timeUpdateSubscription) {
      this._timeUpdateSubscription = vgAPI.subscriptions.timeUpdate.subscribe((() => {
        this.classes.forEach((classification => {
          const name = classification.name;
          const series = classification.series;

          if (classification.checked) {
            if (series.length === 0 || (series.length !== 0 && series[series.length - 1].endTime !== 0)) {
              console.log(name, `labelling started at ${vgAPI.currentTime}`);
              classification.isBeingLabelled = true;
              series.push(new Range(vgAPI.currentTime, 0));
            }
          } else {
            if (classification.isBeingLabelled) {
              console.log(name, `labelling finished at ${vgAPI.currentTime}`);
              classification.isBeingLabelled = false;
              if (series.length !== 0) {
                const range = series[series.length - 1];
                range.endTime = vgAPI.currentTime;
                series[series.length - 1] = range;
              }
              console.log(name, series);
            }
          }

        }));
      }));
    }
  }

  get diagnostic() {
    return JSON.stringify(this.classes);
  }
}
