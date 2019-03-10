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
import { DataGroup, DataItem, DataSet, DateType, IdType, Timeline, TimelineOptions } from 'vis';
import * as hyperid from 'hyperid';
import { LabelsService } from 'src/app/labels/labels.service';
import { ProjectService } from '../project.service';
import { VideoService } from '../../video/video.service';
import { Subscription } from 'rxjs';
import { IMediaSubscriptions } from 'videogular2/src/core/vg-media/i-playable';
import { HotkeysService } from 'angular2-hotkeys';
import { ProjectModel } from '../../models/project.model';
import * as moment from 'moment';
import { Time } from './time';

interface LabelGroup extends DataGroup {
  recording: boolean;
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private projectService: ProjectService,
              private labelsService: LabelsService,
              private videoService: VideoService,
              private hotkeyService: HotkeysService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  @ViewChild('timeline_visualization') timelineVisualization: ElementRef;
  loading = true;

  private project: ProjectModel;
  private instance = hyperid();

  private timeline: Timeline;

  private options: TimelineOptions;

  private groups = new vis.DataSet<LabelGroup>();
  private items: DataSet<DataItem> = new vis.DataSet<DataItem>();
  private customTimeId: IdType;

  private subscription: Subscription;
  private eventEmitter = new EventEmitter();

  private groupTemplate = (group: LabelGroup) => {
    if (group) {
      const container = document.createElement('div');
      container.className = 'checkbox btn';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = `${group.id}`;
      input.addEventListener('change', () => {
        this.eventEmitter.emit({id: group.id, checked: input.checked});
      });

      const label = document.createElement('label');
      label.setAttribute('for', `${group.id}`);
      label.innerHTML = group.content;


      // const container = document.createElement('div');
      // const groupButton = document.createElement('button');
      // groupButton.innerHTML = ` ${group.content}`;
      // groupButton.className = 'btn btn-primary';
      // groupButton.addEventListener('click', () => {
      //   this.groups.update({id: group.id, content: group.content, recording: !group.recording});
      //   console.log(this.groups.get(group.id));
      // });
      // const icon = document.createElement('clr-icon');
      // icon.setAttribute('shape', 'cog');
      // groupButton.prepend(icon);
      // container.insertAdjacentElement('afterbegin', groupButton);

      container.prepend(input);
      container.append(label);
      return container;
    } else {
      return undefined;
    }
  };


  ngOnInit(): void {
    this.subscription = this.projectService.getCurrentProject$()
      .subscribe(project => {
        if (project) {
          this.project = project;
          this.labelsService.getLabels()
            .then(labels => {
              this.groups.clear();
              this.items.clear();

              this.groups.add(labels.map(x => ({id: x.id, content: x.name, recording: false})));
              this.items.add({id: '-1', content: `stub`, start: 0, end: 100});
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

  private observeLabels() {
    this.subscription.add(this.labelsService.newLabels$().subscribe(newLabel => {
      if (newLabel) {
        this.groups.add({id: newLabel.id, content: newLabel.name, recording: false});
      }
    }));

    this.subscription.add(this.labelsService.removedLabels$().subscribe(removed => {
      if (removed) {
        this.groups.remove(removed.id);
      }
    }));

    this.subscription.add(this.labelsService.editedLabels$().subscribe(changed => {
      if (changed) {
        this.groups.update({id: changed.id, content: changed.change, recording: false});
      }
    }));
  }

  ngAfterViewInit() {
    this.options = {
      groupOrder: 'content',  // groupOrder can be a property name or a sorting function,
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
      // groupTemplate: this.groupTemplate
    };

    const labels = [
      {
        id: this.instance(),
        name: 'Loading...',
        series: [
          {
            id: this.instance(),
            start: 0,
            end: Time.seconds(10),
            authorId: this.instance()
          },
        ]
      }
    ];

    for (let i = 0; i < labels.length; ++i) {
      const group = labels[i];
      this.groups.add({id: group.id, content: group.name, recording: false});
      for (let j = 0; j < labels[i].series.length; ++j) {
        const item = group.series[j];
        this.items.add({id: item.id, group: group.id, content: `Loading...`, start: item.start, end: item.end});
      }
    }

    const container = this.timelineVisualization.nativeElement;
    this.timeline = new vis.Timeline(container, this.items, this.groups, this.options);
    this.customTimeId = this.timeline.addCustomTime(Time.seconds(1), 'currentPlayingTime');

    this.loading = false;
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.timeline) {
      this.timeline.destroy();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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

}
