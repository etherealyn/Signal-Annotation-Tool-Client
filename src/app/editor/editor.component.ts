import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ProjectsService } from '../projects/projects.service';
import { ProjectModel } from '../projects/project.model';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styles: []
})
export class EditorComponent implements OnInit {
  private project: ProjectModel;

  constructor(private route: ActivatedRoute,
              private projectService: ProjectsService,
              private location: Location) {
  }

  ngOnInit() {
    this.getProject();
  }

  private getProject() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);
    this.projectService.getProject(id)
      .subscribe(project => {
        this.project = project;
      });
  }

  get diagnostic() {
    return JSON.stringify(this.project);
  }
}
