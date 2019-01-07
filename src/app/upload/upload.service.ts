import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {
  }

  public uploadToProject(id: string, files: Set<File>): { [key: string]: Observable<number> } {
    /* the resulting map*/
    const status = {};

    files.forEach(file => {
      /* create a multipart-form*/
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      /* create a http-post request and pass the form, report the uploadToProject progress */
      const req = new HttpRequest('POST',
        `${this.baseUrl}/projects/projectFilesUpload/${id}`, formData, {
          reportProgress: true
        });

      /* create a new progress subject for every file*/
      const progress = new Subject<number>();

      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          // calculate the process percentage
          const percentDone = Math.round(100 * event.loaded / event.total);
          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // the uploadToProject is complete if we gen an answer from the API
          progress.complete();
        }
      });

      /* Save every progress-observable in a map of all observables*/
      status[file.name] = {
        progress: progress.asObservable()
      };
    });
    return status;
  }
}
