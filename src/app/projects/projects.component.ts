import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectsService } from './projects.service';
import { ProjectModel } from './project.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styles: []
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: ProjectModel[] = [];

  private subscription: Subscription;

  constructor(private projectsService: ProjectsService) {
  }

  ngOnInit() {
    this.getProjects();
  }

  getProjects(): any {
    this.subscription = this.projectsService.getProjects()
      .subscribe(projects => {
        this.projects = projects;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
