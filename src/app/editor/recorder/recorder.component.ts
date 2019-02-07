import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { TimelineComponent } from '../timeline/timeline.component';
import { Classification } from './classification';
import { VgAPI } from 'videogular2/core';
import { IMediaSubscriptions } from 'videogular2/src/core/vg-media/i-playable';
import { Range } from './range';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: [ './recorder.component.scss' ]
})
export class RecorderComponent implements OnInit {

  @ViewChild(TimelineComponent) timelineVisualisation: TimelineComponent;

  constructor() {
  }

  private classes: Classification[] = [];

  private subscription: Subscription;

  ngOnInit() {
    const labellingClasses = [ 'Aurora', 'Sea', 'Thunder' ];

    this.classes = labellingClasses.map(name => {
      return {
        name: name,
        buttonChecked: false,
        finished: false,
        series: []
      };
    });
  }

  onChange(classification: Classification) {
    const prev = classification.buttonChecked;
    classification.buttonChecked = !classification.buttonChecked;
    if (prev === true && classification.buttonChecked === false) {
      classification.finished = true;
    }
  }

  clearLabels() {
    this.classes.forEach(value => {
      value.series = [];
    });
  }


  setVgApi(vgApi: VgAPI) {
    const subscriptions: IMediaSubscriptions = vgApi.subscriptions;
    const timeUpdate = subscriptions.timeUpdate;

    this.subscription = timeUpdate.subscribe((() => {
        this.classes.forEach((classification => {
            const series = classification.series;
            const currentTime = vgApi.currentTime;
            const seriesCount = series.length;

            if (classification.buttonChecked) {
              if (seriesCount === 0 || classification.finished) {
                const range = new Range(currentTime, currentTime);
                series.push(range);
                classification.finished = false;
              } else {
                series[seriesCount - 1].endTime = currentTime;
              }
            }
          })
        );
      })
    );
  }
}
