import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectModel } from '../models/project.model';
import { EditorService } from './editor.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styles: []
})
export class EditorComponent implements OnInit {
  project: ProjectModel;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private editorService: EditorService) {
  }

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    this.editorService.getCurrentProject$().subscribe(project => {
      if (project && project.id === projectId) {
        this.project = project;
      }
    });
    this.editorService.loadProject(projectId);
  }
}
