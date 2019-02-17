import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProjectsService } from '../projects/projects.service';
import { ProjectModel } from '../models/project.model';
import { FileModel } from '../models/file.model';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  private currentProjectSubject: BehaviorSubject<ProjectModel>;
  private readonly currentProject$: Observable<ProjectModel>;

  // private currentFileSubject: BehaviorSubject<FileTreeModel>;
  // private readonly currentFileTree$: Observable<FileTreeModel>;
  //
  // private currentLabelsSubject: BehaviorSubject<LabelModel[]>;
  // private currentLabels: Observable<LabelModel[]>;

  private openFilesSubject: BehaviorSubject<Map<string, FileModel>>;
  private readonly openFiles$: Observable<Map<string, FileModel>>;

  constructor(private projectsService: ProjectsService) {
    this.currentProjectSubject = new BehaviorSubject(null);
    this.currentProject$ = this.currentProjectSubject.asObservable();

    this.openFilesSubject = new BehaviorSubject(new Map<string, FileModel>());
    this.openFiles$ = this.openFilesSubject.asObservable();
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

  openFile(fileModel: FileModel) {
    const openFiles: Map<string, FileModel> = this.openFilesSubject.getValue();
    openFiles.set(fileModel.name, fileModel);
    this.openFilesSubject.next(openFiles);
  }

  getOpenFiles$() {
    return this.openFiles$;
  }

  addLabel(name: string) {
    console.log('add label', name);
  }
}
