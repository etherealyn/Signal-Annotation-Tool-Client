import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Project} from '../models/Project';
import {catchError, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private projectsUrl = `http://localhost:8080/api/projects`;

  constructor(private http: HttpClient) {
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.projectsUrl}`)
      .pipe(
        tap(_ => ProjectsService.log('fetched projects')), // todo: remove
        catchError(this.handleError('getProjects', []))
      );
  }

  getProject(id: string): Observable<Project> {
    const url = `${this.projectsUrl}/${id}`;
    return this.http.get<Project>(url).pipe(
      tap(p => ProjectsService.log(`fetched project id=${p.id}`)), // todo: remove
      catchError(this.handleError<Project>(`getProject id=${id}`))
    );
  }

  insertProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.projectsUrl}/`, project)
      .pipe(
        tap(_ => ProjectsService.log('inserted project')),        // todo: remove
        catchError(this.handleError<Project>(`insertProject ${JSON.stringify(project)}`))
      );
  }

  updateProject(project: Project): Observable<void> {
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

  private static log(m: string) {
    console.log(m);
  }
}
