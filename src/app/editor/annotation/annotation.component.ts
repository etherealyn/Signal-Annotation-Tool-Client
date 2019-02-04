import { Component, Input, OnInit } from '@angular/core';
import { VgAPI } from 'videogular2/core';
import { Subscription } from 'rxjs';

class Range {
  startTime: number;
  endTime: number;

  constructor(startTime: number, endTime?: number) {
    this.startTime = startTime;
    this.endTime = null;
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

  ngOnInit() {
  }

  onStartRecord(api: VgAPI, timeout = 1000) {
    this.timerHandle = setInterval(() => {

      this.classes.forEach(((x, i, xs) => {
        if (x.checked) {
          console.log(x.name, api.currentTime);

          /** if the array is empty*/
          if (x.series.length === 0) {
            x.series.push({
              startTime: api.currentTime,
              endTime: null
            });
          } else {
            const range = x.series[x.series.length - 1];

            /** if the endTime is null, then the previous labelling did not finish*/
            if (range.endTime !== null) {
              x.series.push({
                startTime: api.currentTime,
                endTime: null
              });
            }
          }
        } else {
          if (x.series.length === 0) {

          } else {
            const range = x.series[x.series.length - 1];
            range.endTime = api.currentTime;
          }
        }
        console.log(x.name, x.series);
      }));

    }, timeout);
  }

  onStopRecord() {
    clearInterval(this.timerHandle);
  }

  startRecording(vgAPI: VgAPI) {
    this._timeUpdateSubscription = vgAPI.subscriptions.timeUpdate.subscribe((() => {
      this.classes.forEach((classification => {
        const name = classification.name;
        const series = classification.series;

        if (classification.checked) {
          if (series.length === 0 || (series.length !== 0 && series[series.length - 1].endTime !== null)) {
            console.log(name, `labelling started at ${vgAPI.currentTime}`);
            classification.isBeingLabelled = true;
            series.push(new Range(vgAPI.currentTime));
          }
        } else {
          if (classification.isBeingLabelled) {
            console.log(name, `labelling finished at ${vgAPI.currentTime}`);
            classification.isBeingLabelled = false;
            if (series.length !== 0) {
              series[series.length - 1].endTime = vgAPI.currentTime;
            }
          }
        }
      }));
    }));
  }
}
