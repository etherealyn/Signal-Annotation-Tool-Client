import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {ProjectsService} from '../services/projects.service';
import {Project} from '../models/Project';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styles: []
})
export class EditorComponent implements OnInit {
  private project: Project;

  constructor(private route: ActivatedRoute,
              private projectService: ProjectsService,
              private location: Location) {
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

  get diagnostic() {
    return JSON.stringify(this.project);
  }
}
