import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Project} from '../models/Project';
import {catchError, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private projectsUrl = `http://localhost:8000/api/projects`;

  constructor(private http: HttpClient) {
  }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.projectsUrl}`);
  }

  getProject(id: string) {
    return this.http.get<Project>(`${this.projectsUrl}/` + id);
  }

  insertProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.projectsUrl}/`, project);
  }

  updateProject(project: Project): Observable<void> {
    return this.http.put<void>(`${this.projectsUrl}/` + project.title, project);
  }

  deleteProject(name: string) {
    return this.http.delete(`${this.projectsUrl}/` + name);
  }
}
