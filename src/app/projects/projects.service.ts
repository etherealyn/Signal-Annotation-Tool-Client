import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { ProjectModel } from './project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private projectsUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {
  }

  getProjects(): Observable<ProjectModel[]> {
    return this.http.get<ProjectModel[]>(`${this.projectsUrl}`)
      .pipe(catchError(this.handleError('getProjects', [])));
  }

  getProject(id: string): Observable<ProjectModel> {
    const url = `${this.projectsUrl}/${id}`;
    return this.http.get<ProjectModel>(url).pipe(catchError(this.handleError<ProjectModel>(`getProject id=${id}`))
    );
  }

  insertProject(project: ProjectModel): Observable<any> {
    return this.http.post<ProjectModel>(`${this.projectsUrl}/`, project)
      .pipe(catchError(this.handleError<any>(`insertProject ${JSON.stringify(project)}`)));
  }

  updateProject(project: ProjectModel): Observable<void> {
    return this.http.put<void>(`${this.projectsUrl}/${project.title}`, project);
  }

  deleteProject(name: string): Observable<Object> {
    return this.http.delete(`${this.projectsUrl}/` + name);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
