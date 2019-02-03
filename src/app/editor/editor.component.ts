import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectModel } from '../models/project.model';
import { EditorService } from './editor.service';
import { Subscription } from 'rxjs';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  source?: string;
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: [ './editor.component.scss' ]
})
export class EditorComponent implements OnInit, OnDestroy {
  project: ProjectModel;

  subscription: Subscription;
  direction = 'horizontal';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private editorService: EditorService) {
  }

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    this.subscription = this.editorService.getCurrentProject$().subscribe(project => {
      if (project && project.id === projectId) {
        this.project = project;
      }
    });
    this.editorService.loadProject(projectId);

    this.subscription.add(this.editorService.getOpenFiles$().subscribe(files => {
      console.log(files);
    }));
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
