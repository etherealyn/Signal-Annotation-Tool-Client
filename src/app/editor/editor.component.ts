import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectModel } from '../models/project.model';
import { EditorService } from './editor.service';
import { Subscription } from 'rxjs';
import { VideogridComponent } from './videogrid/videogrid.component';
import { RecorderComponent } from './recorder/recorder.component';
import { IVideo } from './video/video.interface';
import { VgAPI } from 'videogular2/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: [ './editor.component.scss' ]
})
export class EditorComponent implements OnInit, OnDestroy {
  project: ProjectModel;
  videos: IVideo[] = [];

  private subscription: Subscription;

  direction = 'horizontal';
  @ViewChild(VideogridComponent) videoGrid: VideogridComponent;
  @ViewChild(RecorderComponent) annotation: RecorderComponent;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private editorService: EditorService) {
  }

  ngOnInit() {
    /** Get project id from the current route */
    const projectId = this.route.snapshot.paramMap.get('id');

    this.subscription = this.editorService.getCurrentProject$().subscribe(project => {
      if (project && project.id === projectId) {
        this.project = project;

        /** Gather all videos */
        const videos: IVideo[] = [];
        this.project.fileTree.children.forEach((child => {
          if (child.mimetype.startsWith('video')) {
            videos.push({
              source: child.filename
            });
          }
        }));

        this.videos = videos;
      }
    });
    this.editorService.loadProject(projectId);

    // this.subscription.add(this.editorService.getOpenFiles$().subscribe(files => {
    //   console.log(files);
    // }));
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onPlay() {
    this.videoGrid.onPlay();
  }

  onPause() {
    this.videoGrid.onPause();
  }

  onClear() {
    this.annotation.clearLabels();
  }

  onPlayerReady(vgApi: VgAPI) {
    this.annotation.setVgApi(vgApi);
  }
}
