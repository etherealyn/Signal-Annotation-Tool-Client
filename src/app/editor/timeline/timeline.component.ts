import { Component, OnInit } from '@angular/core';
import * as vis from 'vis';
import { Timeline } from 'vis';
import * as moment from 'moment';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: [ './timeline.component.scss' ]
})
export class TimelineComponent implements OnInit {
  private options = {
    groupOrder: 'content',  // groupOrder can be a property name or a sorting function,
    width: '100%',
    margin: {
      item: 20
    }
  };
  private timeline: Timeline;
  private items;

  constructor() {
  }

  ngOnInit(): void {
    const now = moment().minutes(0).seconds(0).milliseconds(0);
    const groupCount = 2;
    const itemCount = 20;

    // create a data set with groups
    const names = [ 'Aurora', 'Sea', 'Thunder' ];
    const groups = new vis.DataSet();
    for (let g = 0; g < groupCount; g++) {
      groups.add({id: g, content: names[g]});
    }

    // create a dataset with items
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
    }

    // create visualization
    const container = document.getElementById('timeline');
    this.timeline = new vis.Timeline(container, items, groups, this.options);
  }

  // ngOnInit() {
  //   // Create a DataSet (allows two way data-binding)
  //   this.items = new vis.DataSet([
  //     {id: 1, content: 'item 1', start: '2013-04-20'},
  //     {id: 2, content: 'item 2', start: '2013-04-14'},
  //     {id: 3, content: 'item 3', start: '2013-04-18'},
  //     {id: 4, content: 'item 4', start: '2013-04-16', end: '2013-04-19'},
  //     {id: 5, content: 'item 5', start: '2013-04-25'},
  //     {id: 6, content: 'item 6', start: '2013-04-27'}
  //   ]);
  //
  //   // Configuration for the Timeline
  //   const options = {
  //     width: '100%',
  //     margin: {
  //       item: 20
  //     }
  //   };
  //
  //   // Create a Timeline
  //   const container = document.getElementById('timeline');
  //   this.timeline = new vis.Timeline(container, this.items, options);
  // }
}
