import { Component, OnInit } from '@angular/core';
import { ProjectsService } from './projects.service';
import { ProjectModel } from '../models/project.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styles: []
})
export class ProjectsComponent implements OnInit {
  projects: ProjectModel[] = [];
  isDatagridView = false;

  constructor(private projectsService: ProjectsService) {
  }

  ngOnInit() {
    this.projectsService.currentProjects$
      .subscribe(projects => {
          this.projects = projects;
        }
      );
  }

  refresh() {
    this.projectsService.reload();
  }

  onInvite() {
    console.log('onInvite');
  }
}
