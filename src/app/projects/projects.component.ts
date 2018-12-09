import {Component, OnInit} from '@angular/core';
import {ProjectsService} from '../services/projects.service';
import {Project} from '../models/Project';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styles: []
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];

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
