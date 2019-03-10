import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as vis from 'vis';
import { DataGroup, DataItem, DataSet, DateType, IdType, Timeline, TimelineOptions } from 'vis';
import * as hyperid from 'hyperid';
import { LabelsService } from 'src/app/labels/labels.service';
import { first } from 'rxjs/operators';
import { ProjectService } from '../project.service';
import { VideoService } from '../../video/video.service';
import { Subscription } from 'rxjs';
import { IMediaSubscriptions } from 'videogular2/src/core/vg-media/i-playable';
import { HotkeysService } from 'angular2-hotkeys';
import { ProjectModel } from '../../models/project.model';
import * as moment from 'moment';
import { Time } from './time';

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
  private options: TimelineOptions = {
    groupOrder: 'content',  // groupOrder can be a property name or a sorting function,
    width: '100%',
    // height: '256px',
    // margin: {
    //   item: 20
    // },
    min: Time.seconds(0),
    start: Time.seconds(0),
    end: Time.seconds(15),
    max: Time.seconds(98), // todo
    moment: function (date) {
      return moment(date).utc();
    },
    // max: 1000,
    editable: true,
    // zoomMin: 10000,
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
    }
  };

  private groups: DataSet<DataGroup> = new vis.DataSet<DataGroup>();
  private items: DataSet<DataItem> = new vis.DataSet<DataItem>();
  private customTimeId: IdType;

  private subscription: Subscription;


  ngOnInit(): void {
    this.subscription = this.projectService.getCurrentProject$()
      .subscribe(project => {
        if (project) {
          this.project = project;
          this.labelsService.getLabels()
            .then(labels => {
              this.groups.clear();
              this.items.clear();

              this.groups.add(labels.map(x => ({id: x.id, content: x.name})));
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
  }

  private observeLabels() {
    this.subscription.add(this.labelsService.newLabels$().subscribe(newLabel => {
      if (newLabel) {
        this.groups.add({id: newLabel.id, content: newLabel.name});
      }
    }));

    this.subscription.add(this.labelsService.removedLabels$().subscribe(removed => {
      if (removed) {
        this.groups.remove(removed.id);
      }
    }));

    this.subscription.add(this.labelsService.editedLabels$().subscribe(changed => {
      if (changed) {
        this.groups.update({id: changed.id, content: changed.change});
      }
    }));
  }

  ngAfterViewInit() {
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
      this.groups.add({id: group.id, content: group.name});
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
