import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as vis from 'vis';
import { DataGroup, DataItem, DataSet, DateType, IdType, Timeline, TimelineOptions } from 'vis';
import * as hyperid from 'hyperid';
import { LabelsService } from 'src/app/labels/labels.service';
import { pairwise, throttleTime } from 'rxjs/operators';
import { ProjectService } from '../project.service';
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
import * as moment from 'moment';
import { lab } from 'd3-color';

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
  private options: TimelineOptions = {
    groupOrder: 'content',  // groupOrder can be a property name or a sorting function,
    width: '100%',
    // height: '256px',
    // margin: {
    //   item: 20
    // },
    start: 0,
    end: 30,
    moment: function (date) {
      return moment(date).utc();
    },
    // max: 1000,
    editable: true,
    // zoomMin: 10000,
    // format: {
    //   minorLabels: {
    //     millisecond: 'SSS',
    //     second: 'mm:ss',
    //     minute: 'HH:mm:ss',
    //     hour: 'HH:mm:ss',
    //     weekday: 'ddd D',
    //     day: 'D',
    //     week: 'w',
    //     month: 'MMM',
    //     year: 'YYYY'
    //   },
    //   majorLabels: {
    //     millisecond: 'HH:mm:ss',
    //     second: 'D MMMM HH:mm',
    //     minute: 'ddd D MMMM',
    //     hour: 'ddd D MMMM',
    //     weekday: 'MMMM YYYY',
    //     day: 'MMMM YYYY',
    //     week: 'MMMM YYYY',
    //     month: 'YYYY',
    //     year: ''
    //   }
    // }
  };
  private groups: DataSet<DataGroup> = new vis.DataSet<DataGroup>();
  private items: DataSet<DataItem> = new vis.DataSet<DataItem>();
  private customTimeId: IdType;

  private subscription: Subscription;

  constructor(private projectService: ProjectService,
              private labelsService: LabelsService,
              private videoService: VideoService,
              private hotkeyService: HotkeysService) {
  }


  ngOnInit(): void {
    this.subscription = this.projectService.getCurrentProject$()
      .subscribe(project => {
        if (project) {
          this.project = project;
          this.labelsService.getLabels()
            .then(labels => {
              console.log(labels);
              this.groups.clear();
              this.items.clear();

              this.groups.add(labels.map(x => ({id: x.id, content: x.name})));
              this.items.add({id: '-1', content: `stub`, start: 0, end: 100});
            });
        }
      });

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
            end: 10,
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
    this.customTimeId = this.timeline.addCustomTime(moment(0).utc().toDate(), 'currentPlayingTime');

    this.loading = false;

    // setTimeout(() => {

    // this.timelineInit(labels);
    // }, 2000);
  }

  timelineInit(labels: any) {
    for (let i = 0; i < labels.length; ++i) {
      const group = labels[i];
      this.groups.add({id: group.id, content: group.name});
      for (let j = 0; j < labels[i].series.length; ++j) {
        const item = group.series[j];
        this.items.add({id: item.id, group: group.id, content: `item ${j}`, start: item.start, end: item.end});
      }
    }

    const container = this.timelineVisualization.nativeElement;
    this.timeline = new vis.Timeline(container, this.items, this.groups, this.options);
    this.customTimeId = this.timeline.addCustomTime(moment(0).utc().toDate(), 'currentPlayingTime');

    this.loading = false;
  }

  ngOnDestroy(): void {
    if (this.timeline) {
      this.timeline.destroy();
      this.timeline = null;
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

}
