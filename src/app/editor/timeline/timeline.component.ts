import { AfterViewInit, Component, ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
  styleUrls: [ './timeline.component.scss' ]
})
export class TimelineComponent implements OnInit, AfterViewInit {
  @ViewChild('timeline_visualization') timelineVisualization: ElementRef;
  loading = true;

  private instance = hyperid();

  private timeline: Timeline;
  private options: TimelineOptions = {
    groupOrder: 'content',  // groupOrder can be a property name or a sorting function,
    width: '100%',
    // height: '256px',
    // margin: {
    //   item: 20
    // },
    min: 0,
    // max: 98,
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

  constructor(private editorService: ProjectService,
              private authService: AuthService,
              private labelService: LabelsService,
              private videoService: VideoService,
              private hotkeyService: HotkeysService) {
  }


  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // setTimeout(() => {
      const labels = [
        {
          id: this.instance(),
          name: 'Activity 1',
          series: [
            {
              id: this.instance(),
              start: 0,
              end: 10,
              authorId: this.instance()
            },
            {
              id: this.instance(),
              start: 15,
              end: 26,
              authorId: this.instance()
            },
          ]
        },
        {
          id: this.instance(),
          name: 'Activity 2',
          series: []
        }
      ];

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

}
