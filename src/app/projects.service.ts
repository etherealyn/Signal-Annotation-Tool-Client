import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Project } from './models/Project';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private http: HttpClient) { }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>('http://localhost:8080/api/projects');
  }

  getProject(id: string) {
    return this.http.get<Project>('http://localhost:8080/api/projects/' + id);
  }

  insertProject(project: Project): Observable<Project> {
    return this.http.post<Project>('http://localhost:8080/api/projects/', project);
  }

  updateProject(project: Project): Observable<void> {
    return this.http.put<void>('http://localhost:8080/api/projects/' + project.name, project);
  }

  deleteProject(name: string) {
    return this.http.delete('http://localhost:8080/api/projects/' + name);
  }
}
