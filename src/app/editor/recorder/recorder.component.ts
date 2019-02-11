import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { TimelineComponent } from '../timeline/timeline.component';
import { Classification } from './classification';
import { VgAPI } from 'videogular2/core';
import { IMediaSubscriptions } from 'videogular2/src/core/vg-media/i-playable';
import { Range } from './range';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: [ './recorder.component.scss' ]
})
export class RecorderComponent implements OnInit, OnChanges {

  // labellingClasses = [ '1', '2', '3', '4'];
  @Input() labellingClasses: string[] = [];

  classes: Classification[] = [];
  private counter: number;
  private subscription: Subscription;

  private currentTimeDelay = 50; // ms
  private timelineUpdateDelay = 50; // ms

  @ViewChild(TimelineComponent) timelineVisualisation: TimelineComponent;

  constructor() {
  }

  ngOnInit() {
    this.counter = 0;
    this.classes = this.labellingClasses.map(name => new Classification(name, []));
  }

  clearLabels() {
    this.classes.forEach(value => {
      value.series = [];
    });
  }

  setVgApi(vgApi: VgAPI) {
    const subscriptions: IMediaSubscriptions = vgApi.subscriptions;
    const timeUpdate = subscriptions.timeUpdate;

    this.subscription = timeUpdate
      .pipe(throttleTime(this.timelineUpdateDelay))
      .subscribe((() => {
          this.classes.forEach(((classification, groupId) => {
              const series = classification.series;
              const currentTime = vgApi.currentTime;
              const seriesCount = series.length;

              if (classification.buttonChecked) {
                if (seriesCount === 0 || classification.finished) {
                  const range = new Range(this.counter, currentTime, currentTime);
                  series.push(range);
                  classification.finished = false;
                  this.counter += 1;
                  this.timelineVisualisation.addItemBox(range.id, groupId, currentTime);
                } else {
                  const lastRange: Range = series[seriesCount - 1];
                  lastRange.endTime = currentTime;
                  this.timelineVisualisation.updateItem(lastRange.id, lastRange.endTime);
                }
              }
            })
          );
        })
      );

    this.subscription.add(timeUpdate.pipe(throttleTime(this.currentTimeDelay)).subscribe(() => {
      this.timelineVisualisation.updateCurrentTime(vgApi.currentTime);
    }));
  }

  onCheckboxChange(cls: Classification, groupId: number) {
    const prev = cls.buttonChecked;
    cls.buttonChecked = !cls.buttonChecked;
    if (prev === true && cls.buttonChecked === false) {
      cls.finished = true;
      // const id = cls.series.length - 1;
      // const range = cls.series[id];
      // this.timelineVisualisation.addItem(range.id, groupId, range.startTime, range.endTime);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.labellingClasses.isFirstChange()) {
      const previous: string[] = changes.labellingClasses.previousValue;
      const current: string[] = changes.labellingClasses.currentValue;

      const newElements = current.filter(item => previous.indexOf(item) < 0);
      const removedElements = previous.filter(item => current.indexOf(item) < 0);
      console.log(newElements);
      console.log(removedElements);
      // todo: propagate changes
    }
  }
}
