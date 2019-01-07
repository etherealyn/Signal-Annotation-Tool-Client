import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styles: []
})
export class LayoutComponent implements OnInit, OnDestroy {

  verticalNavCollapsed = false;
  verticalNavVisible = false;
  rootDirectory: any[] = [
    {
      name: 'Applications',
      icon: 'folder',
      expanded: true,
      files: [
        {
          icon: 'calendar',
          name: 'Calendar',
          active: true
        },
        {
          icon: 'line-chart',
          name: 'Charts',
          active: false
        },
        {
          icon: 'dashboard',
          name: 'Dashboard',
          active: false
        },
        {
          icon: 'map',
          name: 'Maps',
          active: false
        },
      ]
    },
    {
      name: 'Files',
      icon: 'folder',
      expanded: false,
      files: [
        {
          icon: 'file',
          name: 'Cover Letter.doc',
          active: false
        },
      ]
    },
    {
      name: 'Images',
      icon: 'folder',
      expanded: false,
      files: [
        {
          icon: 'image',
          name: 'Screenshot.png',
          active: false
        },
      ]
    }
  ];

  private subscription: Subscription;

  constructor(private router: Router) {
  }

  openFile(directoryName: string, fileName: string) {
    console.log(directoryName, fileName);
  }

  ngOnInit() {
    this.subscription = this.router.events.subscribe(
      (e: RouterEvent) => {
        const url = e.url;
        if (url) {
          this.verticalNavVisible = url.startsWith('/editor');
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getWidth() {
    return this.verticalNavCollapsed ? {} : { width: '13rem' };
  }

  getRootDirectory() {
    return this.verticalNavCollapsed ? [] : this.rootDirectory;
  }
}
