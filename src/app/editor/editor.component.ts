import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectModel } from '../models/project.model';
import { ProjectEditorService } from './project-editor.service';
import { Subscription } from 'rxjs';
import { VideogridComponent } from '../video/videogrid/videogrid.component';
import { RecorderComponent } from './recorder/recorder.component';
import { IVideo } from '../video/video.interface';
import { VgAPI } from 'videogular2/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: [ './editor.component.scss' ]
})
export class EditorComponent implements OnInit {
  constructor(private route: ActivatedRoute,
              private router: Router,
              private editorService: ProjectEditorService) {
  }

  project: ProjectModel;
  direction = 'horizontal';

  ngOnInit() {
    /** Get project id from the current route */
    const projectId = this.route.snapshot.paramMap.get('id');
    this.editorService.loadProject(projectId);
  }

  onPlay() {
    // this.videoGrid.onPlay();
  }

  onPause() {
    // this.videoGrid.onPause();
  }

  onClear() {
    // this.recorder.clearLabels();
  }

  onPlayerReady(vgApi: VgAPI) {
    // this.recorder.setVgApi(vgApi); // fixme
  }
}
