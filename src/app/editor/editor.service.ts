import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProjectsService } from '../projects/projects.service';
import { ProjectModel } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  private currentProjectSubject: BehaviorSubject<ProjectModel>;
  private readonly currentProject$: Observable<ProjectModel>;

  constructor(private projectsService: ProjectsService) {
    this.currentProjectSubject = new BehaviorSubject(null);
    this.currentProject$ = this.currentProjectSubject.asObservable();
  }

  loadProject(id: string) {
    const currentProject = this.getCurrentProjectValue();
    if (!currentProject || (currentProject && currentProject.id !== id)) {
      this.projectsService.getProject(id)
        .toPromise()
        .then(value => this.currentProjectSubject.next(value));
    }
  }

  getCurrentProject$(): Observable<ProjectModel> {
    return this.currentProject$;
  }

  private getCurrentProjectValue(): ProjectModel {
    return this.currentProjectSubject.getValue();
  }

  addLabel(name: string) {
    console.log('Add label', name);
  }

  reloadCurrentProject() {
    this.projectsService.getProject(this.getCurrentProjectValue().id)
      .toPromise()
      .then(value => this.currentProjectSubject.next(value));
  }

  deleteFile(filename: string) {
    this.projectsService.deleteFile(this.getCurrentProjectValue().id, filename);
  }
}
