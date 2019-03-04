import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectModel } from '../models/project.model';
import { ProjectEditorService } from './project-editor.service';
import { VgAPI } from 'videogular2/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  constructor(private route: ActivatedRoute,
    private router: Router,
    private editorService: ProjectEditorService) {
  }

  project: ProjectModel;
  direction = 'vertical';
  labelNames: string[] = [];

  ngOnInit() {
    /** Get project id from the current route */
    const projectId = this.route.snapshot.paramMap.get('id');
    this.editorService.loadProject(projectId);

    this.editorService.getCurrentProject$()
      .subscribe((value) => {
        if (value && value.labels) {
          this.labelNames = value.labels.map(x => x.name);
        }
      });
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
