import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import * as vis from 'vis';
import { DataGroup, DataItem, DateType, IdType, Timeline, TimelineOptions } from 'vis';
import * as hyperid from 'hyperid';
import { LabelsService } from 'src/app/labels/labels.service';
import { pairwise, throttleTime } from 'rxjs/operators';
import { ProjectEditorService } from '../project-editor.service';
import { Classification } from '../../models/classification';
import { VideoService } from '../../video/video.service';
import { VgAPI } from 'videogular2/core';
import { LinkedList } from 'typescript-collections';
import { Subscription } from 'rxjs';
import { IMediaSubscriptions } from 'videogular2/src/core/vg-media/i-playable';
import { Range } from '../../models/range';
import { RecordingEvent } from '../../models/recording.event';
import { RecordingEventType } from '../../models/recording.event.type';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { AuthService } from '../../auth/auth.service';
import { LabelModel } from '../../models/label.model';
import { ProjectModel } from '../../models/project.model';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: [ './timeline.component.scss' ]
})
export class TimelineComponent implements OnInit, OnChanges, OnDestroy {

  private project: ProjectModel;
  private recordingEvents = new EventEmitter<RecordingEvent>();
  private instance = hyperid();

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

  private classes: Classification[];
  private groups = new vis.DataSet<DataGroup>();
  private items = new vis.DataSet<DataItem>();
  private playbackTimeId: IdType;
  private subscription: Subscription;


  constructor(private editorService: ProjectEditorService,
              private authService: AuthService,
              private labelService: LabelsService,
              private videoService: VideoService,
              private hotkeyService: HotkeysService) {
    this.registerHotkeys();
  }

  private registerHotkeys() {
    for (let i = 0; i < 9; ++i) {
      const hotkey = new Hotkey(`${i + 1}`, (event: KeyboardEvent): boolean => {
        const clazz = this.classes[i];
        if (clazz) {
          this.toggleRecording(clazz);
        }
        return false;
      }, undefined, `Toggle recording of the ${i + 1} label`);
      this.hotkeyService.add(hotkey);
    }

    this.hotkeyService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      console.log('save');
      return false;
    }, undefined, `Save the labels on the server`));

    this.hotkeyService.add(new Hotkey('ctrl+e', (event: KeyboardEvent): boolean => {
      console.log('export');
      return false;
    }, undefined, `Export the labels`));
  }

  private toggleRecording(cls: Classification) {
    const prev = cls.buttonChecked;
    cls.buttonChecked = !cls.buttonChecked;
    /** if button's checked state switches from true to false, it means that the user wished to stop the recording*/
    if (prev === true && cls.buttonChecked === false) {
      cls.isLabellingFinished = true;
      const range = cls.series[cls.series.length - 1];
      this.recordingEvents.emit({eventType: RecordingEventType.Stop, labelId: cls.id, range: range});
    }
  }

  ngOnInit(): void {
    this.subscription = this.labelService.getLabels$()
      .pipe(pairwise(), throttleTime(50))
      .subscribe((value) => {
          // this.classes = value.labels.map(x => new Classification(x.name, [])); // fixme seriesl
          const prev = value[0].labels;
          const curr = value[1].labels;

          if (prev && curr) {
            /** if the length of previous and current arrays is the same then:
             * 1) this is the first observable value: no previous element exists
             * 2) an element was edited
             * */
            if (prev.length === curr.length) {
              curr.forEach(x => {
                if (!this.groups.get(x.id)) {
                  this.groups.add({id: x.id, content: x.name});
                }
              });

              const edited = curr.filter(x => !prev.find(y => x.id === y.id && y.name === x.name));
              edited.forEach(x => {
                const group: DataGroup = this.groups.get(x.id);
                if (group) {
                  group.content = x.name;
                  this.groups.update(group);
                }
              });
            } else {
              /** if the length of previous and current arrays is different, then an element was either added or removed */
              const added = curr.filter(x => !prev.find(y => x.id === y.id));
              const deleted = prev.filter(x => !curr.find(y => x.id === y.id));

              added.forEach(x => {
                const newGroup = {id: x.id, content: x.name};
                this.groups.add(newGroup);
              });
              deleted.forEach(x => {
                this.groups.remove(x.id);
              });
            }
          }
        }
      );

    this.subscription.add(this.editorService.getCurrentProject$()
      .subscribe((project: ProjectModel) => {
        if (project) {
          this.project = project;
          const labels = project.labels;
          if (labels) {
            labels.forEach((x) => {
              this.groups.add({id: x.id, content: x.name});
            });
          }
        }
      }));

    this.subscription.add(this.videoService.playerReady
      .subscribe((api: VgAPI) => {
        this.apis.add(api);
        const sub: IMediaSubscriptions = api.subscriptions;
        if (this.apis.size() === 1) {
          this.subscription.add(sub.timeUpdate.subscribe(() => {
            this.updateCurrentTime(api.currentTime);

            this.classes.forEach((($class) => {
              const series = $class.series;
              const currentTime = api.currentTime;
              const seriesCount = series.length;
              const groupId = $class.id;
              const authorId = this.authService.currentUserValue.id;

              if ($class.buttonChecked) {
                /** if the range list is empty or the labelling is finished we need to add a new range element*/
                if (seriesCount === 0 || $class.isLabellingFinished) {
                  const rangeId = this.instance();
                  const range = new Range(rangeId, authorId, currentTime, currentTime);
                  series.push(range);
                  $class.isLabellingFinished = false;
                  this.addItemBox(rangeId, groupId, currentTime);
                  this.recordingEvents.emit({eventType: RecordingEventType.Start, labelId: groupId, range: range});
                } else {
                  const lastRange: Range = series[seriesCount - 1];
                  lastRange.endTime = currentTime;
                  this.updateItem(lastRange.id, lastRange.endTime);
                  this.recordingEvents.emit({eventType: RecordingEventType.Recording, labelId: groupId, range: lastRange});
                }
              }
            }));
          }));

          this.subscription.add(sub.durationChange.subscribe(() => {
            this.setMax(api.duration);
          }));
        }
      }));

    this.subscription.add(this.labelService.getLabels$().subscribe(value => {
      this.classes = this.labelsToClasses(value.labels);
      console.log('getLabels', this.classes);
    }));

    this.subscription.add(this.editorService.getCurrentProject$()
      .subscribe(value => {
        if (value) {
          this.classes = this.labelsToClasses(value.labels);
          console.log('getCurrentProject', this.classes);
          this.classes.forEach(label => {
            if (label.series) {
              const ranges = label.series;
              ranges.forEach(range => {
                const count = this.items.length;
                if (!this.items.get(range.id)) {
                  this.items.add({id: range.id, group: label.id, content: `Label ${count}`, start: range.startTime, end: range.endTime});
                }
              });
            }
          });
        }
      }));

    // create visualization
    const container = document.getElementById('timeline');
    this.timeline = new vis.Timeline(container, this.items, this.groups, this.options);
    this.playbackTimeId = this.timeline.addCustomTime(0.0, 'currentPlayingTime');


    this.subscription.add(this.recordingEvents.subscribe((event: RecordingEvent) => {
      switch (event.eventType) {
        case RecordingEventType.Start:
          // console.log('recording started');
          break;
        case RecordingEventType.Stop:
          console.log('recording stopped', JSON.stringify(event.range));
          if (this.project) {
            this.labelService.addRange(this.project.id, event.labelId, event.range);
          }
          break;
        case RecordingEventType.Recording:
          // console.log('recording ...');
          break;
        default:
          break;
      }
    }));

    // create a dataset with items
    /*
    const items = new vis.DataSet();
    for (let i = 0; i < itemCount; i++) {
      const startTime = now.clone().add(Math.random() * 200, 'hours');
      const group = Math.floor(Math.random() * groupCount);
      items.add({
        id: i,
        group: group,
        content: 'item ' + i +
          ' <span style="color:#97B0F8;">(' + names[group] + ')</span>',
        startTime: startTime,
        type: 'box'
      });
    }*/

    // this.timeline.on('timechanged', function (properties) {
    //   // console.log(properties);
    // });
    this.items.on('remove', (event, properties, senderId) => {
      console.log(event, properties);
      if (event === 'remove') {
        const id = properties.items[0];
        const groupId = properties.oldData[0].group;
        this.labelService.removeRange(this.project.id, groupId, id);
      }
    });
  }

  private labelsToClasses(labels: LabelModel[]) {
    return labels.map(label => {
      const ranges: Range[] = label.series
        ? label.series.map(range => new Range(range.id, range.authorId, range.startTime, range.endTime))
        : [];
      return new Classification(label.id, label.name, label.authorId, ranges);
    });
  }

  addItemBox(id: string, groupId: number | string, start: number | string) {
    const count = this.items.length;
    const item: DataItem = {id: id, group: groupId, content: `Label ${count}`, start: start, end: start};
    this.items.add(item);
    this.timeline.focus(id);
  }

  updateItem(id: string, endTime: number) {
    const item: DataItem = this.items.get(id);
    if (item) {
      item.end = endTime;
      this.items.update(item);
    }
  }

  updateCurrentTime(time: number) {
    this.timeline.setCustomTime(time, this.playbackTimeId);
    // this.timeline.moveTo(time); todo
  }

  ngOnDestroy(): void {
    this.timeline.destroy();
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  onCheckboxChange(clazz: Classification) {
    this.toggleRecording(clazz);
  }

  private setMax(duration: DateType) {
    const newOptions: TimelineOptions = Object.assign({}, this.options);
    newOptions.max = duration;
    this.timeline.setOptions(newOptions);
  }
}
