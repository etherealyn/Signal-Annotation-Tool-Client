import { Component, Input, OnInit } from '@angular/core';
import * as vis from 'vis';
import { DataItem, DataSet, Timeline } from 'vis';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: [ './timeline.component.scss' ]
})
export class TimelineComponent implements OnInit {

  @Input() groupNames: string[];

  private options = {
    groupOrder: 'content',  // groupOrder can be a property name or a sorting function,
    width: '100%',
    // height: '256px',
    // margin: {
    //   item: 20
    // },
    min: 0,
    max: 100
  };
  private timeline: Timeline;
  private items: DataSet<DataItem>;

  constructor() {
  }

  ngOnInit(): void {
    // const now = moment().minutes(0).seconds(0).milliseconds(0);
    // create a data set with groups
    const groups = new vis.DataSet();
    for (let g = 0; g < this.groupNames.length; g++) {
      groups.add({id: g, content: this.groupNames[g]});
    }

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

    this.items = new vis.DataSet([
      {id: 0, group: 0, className: 'expected', content: 'hidden item', start: 50},
    ]);

    // create visualization
    const container = document.getElementById('timeline');
    this.timeline = new vis.Timeline(container, this.items, groups, this.options);
  }

  addItem(groupId: number, start: number | string, end: number | string) {
    const id = this.items.length;
    const item = {id: id, group: groupId, content: 'item ' + id, start: start, end: end};
    this.items.add(item);
    this.timeline.focus(id);
  }
}
