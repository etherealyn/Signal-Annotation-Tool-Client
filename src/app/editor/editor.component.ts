import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProjectsService } from '../projects/projects.service';
import { ProjectModel } from '../projects/project.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styles: []
})
export class EditorComponent implements OnInit {
  private project: ProjectModel;

  constructor(private route: ActivatedRoute,
              private projectService: ProjectsService) {
  }

  ngOnInit() {
    this.getProject();
  }

  private getProject() {
    const id = this.route.snapshot.paramMap.get('id');
    this.projectService.getProject(id)
      .subscribe(project => {
        this.project = project;
      });
  }
}
