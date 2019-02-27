import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import * as vis from 'vis';
import { DataItem, DataSet, DateType, IdType, Timeline, TimelineOptions } from 'vis';
import { LabelsService } from 'src/app/labels/labels.service';
import { takeLast, pairwise, take, first, throttleTime, last } from 'rxjs/operators';
import { map } from 'd3';
import { LabelModel } from 'src/app/models/label.model';
import { ProjectEditorService } from '../project-editor.service';
import { Classification } from '../../models/classification';
import { VideoService } from '../../video/video.service';
import { VgAPI } from 'videogular2/core';
import { LinkedList } from 'typescript-collections';
import { Subscription } from 'rxjs';
import { IMediaSubscriptions } from 'videogular2/src/core/vg-media/i-playable';
import { Range } from '../../models/range';
import { Set } from 'typescript-collections';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: [ './timeline.component.scss' ]
})
export class TimelineComponent implements OnInit, OnChanges, OnDestroy {

  constructor(private editorService: ProjectEditorService,
              private labelService: LabelsService,
              private videoService: VideoService) {
  }

  private classes: Classification[];
  private apis: LinkedList<VgAPI> = new LinkedList<VgAPI>();
  private options: TimelineOptions = {
    groupOrder: 'content',  // groupOrder can be a property name or a sorting function,
    width: '100%',
    // height: '256px',
    // margin: {
    //   item: 20
    // },
    min: 0,
    max: 100, // to-do: fixme,
    editable: true,
  };
  private timeline: Timeline;
  private groups = new vis.DataSet();
  private items: DataSet<DataItem> = new vis.DataSet();
  private playbackTimeId: IdType;
  private subscription: Subscription;
  private counter = 0;

  keyBindings = new Map<string, number>([
    [ 'Digit1', 0 ],
    [ 'Digit2', 1 ],
    [ 'Digit3', 2 ],
    [ 'Digit4', 3 ],
    [ 'Digit5', 4 ],
    [ 'Digit6', 5 ],
    [ 'Digit7', 6 ],
    [ 'Digit8', 7 ],
    [ 'Digit9', 8 ],

    [ 'Numpad1', 0 ],
    [ 'Numpad2', 1 ],
    [ 'Numpad3', 2 ],
    [ 'Numpad4', 3 ],
    [ 'Numpad5', 4 ],
    [ 'Numpad6', 5 ],
    [ 'Numpad7', 6 ],
    [ 'Numpad8', 7 ],
    [ 'Numpad9', 8 ]
  ]);

  ngOnInit(): void {
    console.log('ngOnInit');
    console.log('ngOnInit', 'enter');
    this.subscription = this.labelService.getLabels$()
      .pipe(pairwise(), throttleTime(50))
      .subscribe((value) => {
          // this.classes = value.labels.map(x => new Classification(x.name, [])); // fixme series
          console.log('ngOnInit', 'getLabels', value);
          const prev = value[0].labels;
          const curr = value[1].labels;

          if (prev && curr) {
            if (prev.length !== curr.length) {
              const added = curr.filter(x => !prev.find(y => x.id === y.id));
              const deleted = prev.filter(x => !curr.find(y => x.id === y.id));
              console.log('ngOnInit', 'add/delete', {added, deleted});

              added.forEach(x => {
                this.groups.add({id: x.id, content: x.name});
              });
              deleted.forEach(x => this.groups.remove(x.id));

              // console.log('  added ', JSON.stringify(added));
              // console.log('deleted ', JSON.stringify(deleted));
            } else {
              curr.forEach(x => {
                this.groups.add({id: x.id, content: x.name});
              });
            }
          }
        }
      );

    this.subscription.add(this.editorService.getCurrentProject$()
      .subscribe(value => {
        console.log('ngOnInit', 'getCurrentProject', value);
        if (value) {
          const labels = value.labels;
          if (labels) {
            labels.forEach((x) => {
              this.groups.add({id: x.id, content: x.name});
            });
          }
        }
      }));

    this.subscription.add(this.videoService.playerReady
      .subscribe((api: VgAPI) => {
        console.log('ngOnInit', 'playerReady');
        this.apis.add(api);
        const sub: IMediaSubscriptions = api.subscriptions;
        if (this.apis.size() === 1) {
          this.subscription.add(sub.timeUpdate.subscribe(() => {
            console.log('ngOnInit', 'timeUpdate', api.currentTime);
            this.updateCurrentTime(api.currentTime);

            this.classes.forEach((($class) => {
              const series = $class.series;
              const currentTime = api.currentTime;
              const seriesCount = series.length;
              const groupId = $class.id;

              if ($class.buttonChecked) {
                if (seriesCount === 0 || $class.finished) {
                  const range = new Range(this.counter, currentTime, currentTime);
                  series.push(range);
                  $class.finished = false;
                  this.counter += 1;
                  this.addItemBox(range.id, groupId, currentTime);
                } else {
                  const lastRange: Range = series[seriesCount - 1];
                  lastRange.endTime = currentTime;
                  this.updateItem(lastRange.id, lastRange.endTime);
                }
              }
            }));
          }));

          // this.subscription.add(sub.durationChange.subscribe(() => {
          //   this.setMax(api.duration);
          // }));
        }
      }));

    this.subscription.add(this.labelService.getLabels$().subscribe(value => {
      console.log('ngOnInit', 'getLabels', 'classes');
      this.classes = value.labels.map(x => new Classification(x.id, x.name, [])); // fixme series
    }));

    this.subscription.add(this.editorService.getCurrentProject$()
      .subscribe(value => {
        console.log('ngOnInit', 'getLabels', 'classes');
        if (value) {
          this.classes = value.labels.map(x => new Classification(x.id, x.name, []));
        }
      }));

    // create visualization
    const container = document.getElementById('timeline');
    this.timeline = new vis.Timeline(container, this.items, this.groups, this.options);
    this.playbackTimeId = this.timeline.addCustomTime(0.0, 'currentPlayingTime');


    // create a dataset with items
    /*
    const items = new vis.DataSet();
    for (let i = 0; i < itemCount; i++) {
      const start = now.clone().add(Math.random() * 200, 'hours');
      const group = Math.floor(Math.random() * groupCount);
      items.add({
        id: i,
        group: group,
        content: 'item ' + i +
          ' <span style="color:#97B0F8;">(' + names[group] + ')</span>',
        start: start,
        type: 'box'
      });
    }*/

    // this.timeline.on('timechanged', function (properties) {
    //   // console.log(properties);
    // });
  }

  addItemBox(id: number, groupId: number | string, start: number | string) {
    console.log('addItemBox: ', id, groupId, start);
    const item: DataItem = {id: id, group: groupId, content: 'item ' + id, start: start, end: start};
    this.items.add(item);
    this.timeline.focus(id);
  }

  updateItem(id: number, endTime: number) {
    const item: DataItem = this.items.get(id);
    if (item) {
      item.end = endTime;
      this.items.update(item);
    }
  }

  updateCurrentTime(time: number) {
    this.timeline.setCustomTime(time, this.playbackTimeId);
  }

  ngOnDestroy(): void {
    this.timeline.destroy();
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  // private initRecorder(vgApi: VgAPI) {
  //   const subscriptions: IMediaSubscriptions = vgApi.subscriptions;
  //   const timeUpdate = subscriptions.timeUpdate;
  //
  //   timeUpdate
  //     .pipe(throttleTime(50))
  //     .subscribe((() => {
  //         this.classes.forEach(((classification, groupId) => {
  //             const series = classification.series;
  //             const currentTime = vgApi.currentTime;
  //             const seriesCount = series.length;
  //
  //             if (classification.buttonChecked) {
  //               if (seriesCount === 0 || classification.finished) {
  //                 const range = new Range(this.counter, currentTime, currentTime);
  //                 series.push(range);
  //                 classification.finished = false;
  //                 this.counter += 1;
  //                 this.addItemBox(range.id, groupId, currentTime);
  //               } else {
  //                 const lastRange: Range = series[seriesCount - 1];
  //                 lastRange.endTime = currentTime;
  //                 this.updateItem(lastRange.id, lastRange.endTime);
  //               }
  //             }
  //           })
  //         );
  //       })
  //     );
  //
  // }

  onCheckboxChange(cls: Classification, groupId: number | string) {
    const prev = cls.buttonChecked;
    cls.buttonChecked = !cls.buttonChecked;
    if (prev === true && cls.buttonChecked === false) {
      cls.finished = true;
      // const id = cls.series.length - 1;
      // const range = cls.series[id];
      // this.timelineVisualisation.addItem(range.id, groupId, range.startTime, range.endTime);
    }
  }

  private setMax(duration: DateType) {
    const newOptions: TimelineOptions = Object.assign({}, this.options);
    newOptions.max = duration;
    this.timeline.setOptions(newOptions);
  }

  @HostListener('window:keydown', [ '$event' ])
  onKeyDown(event: KeyboardEvent) {
    console.log('keydown');
    const clazz = this.classes[this.keyBindings.get(event.code)];
    console.log(clazz);
    if (clazz) {
      clazz.buttonChecked = !clazz.buttonChecked;
    }
  }
}
