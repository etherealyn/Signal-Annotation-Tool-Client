import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import * as vis from 'vis';
import { DataItem, DataSet, DateType, IdType, Timeline, TimelineOptions } from 'vis';
import * as hyperid from 'hyperid';
import * as moment from 'moment';
import { LabelsService } from 'src/app/labels/labels.service';
import { ProjectService } from '../project.service';
import { VideoService } from '../../video/video.service';
import { Subscription } from 'rxjs';
import { IMediaSubscriptions } from 'videogular2/src/core/vg-media/i-playable';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ProjectModel } from '../../models/project.model';
import { Time } from './time';
import { LabelGroup } from './label.group';
import { TimelineData } from './timeline.data';
import { LabelModel } from '../../models/label.model';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('timeline_visualization') timelineVisualization: ElementRef;

  loading = true;
  private project: ProjectModel;

  private instance = hyperid();
  private timeline: Timeline;

  private options;

  private timelineData: TimelineData = new TimelineData();
  private customTimeId: IdType;
  private subscription: Subscription;

  private eventEmitter = new EventEmitter();

  constructor(private projectService: ProjectService,
              private labelsService: LabelsService,
              private videoService: VideoService,
              private hotkeyService: HotkeysService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.subscription = this.projectService.getCurrentProject$()
      .subscribe(project => {
        if (project) {
          this.project = project;
          this.labelsService.getLabels()
            .then((labels: LabelModel[]) => {
              this.timelineData.clear();
              this.timelineData.addGroups(labels.map(x => ({ id: x.id, content: x.name, recording: false })));
              this.timelineData.addItem({id: '-1', content: `stub`, start: 0, end: 100});
            });
        }
      });
    this.observeLabels();

    this.subscription.add(this.videoService.playerReady
      .subscribe(event => {
        const api = event.api;
        const index = event.index;
        if (api && index === 0) {
          const subscriptions: IMediaSubscriptions = api.subscriptions;
          this.subscription.add(subscriptions.canPlay.subscribe(() => {
            this.updateCurrentTime(Time.seconds(api.currentTime));
          }));
          this.subscription.add(subscriptions.timeUpdate.subscribe(() => {
            this.updateCurrentTime(Time.seconds(api.currentTime));
          }));

          this.subscription.add(subscriptions.durationChange.subscribe(() => {
            this.setMax(Time.seconds(api.duration));
          }));
        }
      }));

    this.subscription.add(this.eventEmitter.subscribe(x => console.log(x)));
  }

  private groupTemplate = (group: LabelGroup) => {
    if (group) {
      const container = document.createElement('div');
      container.className = 'checkbox btn';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = `checkbox_${group.id}`;
      input.addEventListener('change', () => {
        this.eventEmitter.emit({id: group.id, checked: input.checked});
      });

      const label = document.createElement('label');
      label.setAttribute('for', `checkbox_${group.id}`);
      label.innerHTML = group.content;

      container.prepend(input);
      container.append(label);
      return container;
    }
    return undefined;
  }

  private observeLabels() {
    this.subscription.add(this.labelsService.newLabels$().subscribe(newLabel => {
      if (newLabel) {
        const group: LabelGroup = {id: newLabel.id, content: newLabel.name, recording: false};
        this.timelineData.addGroup(group);
      }
    }));

    this.subscription.add(this.labelsService.removedLabels$().subscribe(removed => {
      if (removed) {
        this.timelineData.removeGroup(removed.id);
      }
    }));

    this.subscription.add(this.labelsService.editedLabels$().subscribe(changed => {
      if (changed) {
        this.timelineData.updateGroup({id: changed.id, content: changed.change, recording: false});
      }
    }));
  }

  private registerHotkeys() {
    const hotkeys = [];
    for (let i = 0; i < 9; ++i) {
      const hotkey = new Hotkey(
        `${i + 1}`,
        (): boolean => {
          const ids: IdType[] = this.timelineData.getGroupIds();
          const id = ids[i];
          const checkbox = document.getElementById(`checkbox_${id}`);
          if (checkbox) {
            checkbox.click();
          }
          return false;
        },
        undefined,
        `Toggle recording of the ${i + 1} label`);
      hotkeys.push(hotkey);
    }
    this.hotkeyService.add(hotkeys);
  }

  ngAfterViewInit() {
    this.options = {
      // groupOrder: 'content',  // groupOrder can be a property name or a sorting function,
      width: '100%',
      min: Time.seconds(0),
      start: Time.seconds(0),
      end: Time.seconds(15),
      max: Time.seconds(98), // todo
      moment: function (date) {
        return moment(date).utc();
      },
      editable: true,
      format: {
        minorLabels: {
          millisecond: 'ss.SSS',
          second: 'HH:mm:ss',
          minute: 'HH:mm:ss',
          hour: 'HH:mm',
          weekday: 'HH:mm',
          day: 'HH:mm',
          week: 'HH:mm',
          month: 'HH:mm',
          year: 'HH:mm'
        },
        majorLabels: {
          // millisecond: 'HH:mm:ss',
          // second: 'D MMMM HH:mm',
          // minute: 'ddd D MMMM',
          // hour: 'ddd D MMMM',
          // weekday: 'MMMM YYYY',
          // day: 'MMMM YYYY',
          // week: 'MMMM YYYY',
          // month: 'YYYY',
          // year: '',
          // millisecond: 'HH:mm:ss',
          second: 'HH:mm:ss',
          minute: 'HH:mm:ss',
          hour: '',
          weekday: '',
          day: '',
          week: '',
          month: '',
          year: ''
        }
      },
      groupTemplate: this.groupTemplate
    };

    const container = this.timelineVisualization.nativeElement;
    this.timeline = new vis.Timeline(container, this.timelineData.items, this.timelineData.groups, this.options);
    this.customTimeId = this.timeline.addCustomTime(Time.seconds(1), 'currentPlayingTime');
    this.timeline.setCustomTimeTitle('', this.customTimeId);

    // this.timeline.on('timechange', function (properties) {
    //   const id = properties.id;
    //   const time = properties.time;
    //   console.log({id, time});
    // });
    this.timeline.on('timechanged', properties => {
      // const id = properties.id; todo
      const time = moment(properties.time).utc();

      const videoSeek = time.seconds() + time.minutes() * 60 + time.hours() * 360 + time.milliseconds() / 1000;
      this.videoService.seekTo(videoSeek);
      // this.timeline.setCustomTimeTitle(time.format('H:mm:ss'), id); todo
    });

    this.loading = false;
    this.changeDetectorRef.detectChanges();

    this.registerHotkeys();

    // force a timeline redraw, because sometimes it does not detect changes
    setTimeout(() => this.timeline.redraw(), 250);
  }

  updateCurrentTime(millis: number) {
    this.timeline.setCustomTime(millis, this.customTimeId);
    const start = this.timeline.getWindow().start.getTime();
    const end = this.timeline.getWindow().end.getTime();

    const delta = (end - start) / 2; // center
    if (millis < start || end < millis + delta) {
      this.timeline.moveTo(millis, {animation: false});
    }
  }

  private setMax(duration: DateType) {
    const newOptions: TimelineOptions = Object.assign({}, this.options);
    newOptions.max = duration;
    this.timeline.setOptions(newOptions);
  }

  ngOnDestroy(): void {
    if (this.timeline) {
      this.timeline.destroy();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
