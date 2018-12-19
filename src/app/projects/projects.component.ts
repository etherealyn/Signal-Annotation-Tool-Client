import { Component, OnInit } from '@angular/core';
import { ProjectsService } from './projects.service';
import { ProjectModel } from './project.model';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styles: []
})
export class ProjectsComponent implements OnInit {
  projects: ProjectModel[] = [];

  constructor(private projectsService: ProjectsService) {
  }

  ngOnInit() {
    this.getProjects();
  }

  getProjects(): any {
    this.projectsService.getProjects()
      .subscribe(projects => {
        this.projects = projects;
      });
  }
}
