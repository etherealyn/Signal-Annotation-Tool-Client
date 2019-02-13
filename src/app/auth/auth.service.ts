import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {BehaviorSubject, Observable, of} from 'rxjs';

import {environment} from '../../environments/environment';
import {SessionModel} from '../models/session.model';
import {UserModel} from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = `${environment.apiUrl}/auth`;

  private currentSessionSubject: BehaviorSubject<SessionModel>;
  public currentSession$: Observable<SessionModel>;

  constructor(private http: HttpClient) {
    this.currentSessionSubject = new BehaviorSubject<SessionModel>(JSON.parse(localStorage.getItem('currentSession$')));
    this.currentSession$ = this.currentSessionSubject.asObservable();
  }

  public get currentSessionValue(): SessionModel {
    return this.currentSessionSubject.value;
  }

  public get currentUserValue(): UserModel {
    if (this.currentSessionSubject.value) {
      return this.currentSessionSubject.value.user;
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<SessionModel>(this.authUrl, {username, password})
      .pipe(map(session => {
          if (session && session.user && session.accessToken) {
            localStorage.setItem('currentSession$', JSON.stringify(session));
            this.currentSessionSubject.next(session);
          }
          return session;
        })
      );
  }

  logout() {
    localStorage.removeItem('currentSession$');
    this.currentSessionSubject.next(null);
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

  isLoggedIn() {
    return this.currentSessionSubject.getValue();
  }
}
