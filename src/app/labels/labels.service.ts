import { Injectable } from '@angular/core';
import { LabelPayload } from './label.payload';
import { LabelsSocket } from './labels.socket';
import { Labels } from '../interfaces/ILabels';
import { Range } from '../models/range';
import { IdType } from 'vis';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LabelsService {

  constructor(private socket: LabelsSocket, private http: HttpClient) {

    this.socket.on('connect', () => {
      console.log('Connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected');
    });
  }

  addLabel(payload: LabelPayload) {
    this.socket.emit('addLabel', payload);
  }

  getLabels$() {
    return this.socket.fromEvent<Labels>('getLabels');
  }

  editLabelName(projectId: string, labelId: string, name: string) {
    this.socket.emit('editLabel', {projectId, labelId, name});
  }

  deleteLabel(projectId: string, labelId: string) {
    this.socket.emit('deleteLabel', {projectId, labelId});
  }

  addRange(projectId: string, labelId: string, range: Range) {
    this.socket.emit('addRange', {projectId, labelId, range});
  }

  removeRange(projectId: string, labelId: string, rangeId: string) {
    const payload = {projectId, labelId, rangeId};
    this.socket.emit('removeRange', payload);
  }

  getLabelsCsv(projectId: string) {
    const url = `${environment.apiUrl}/project/labels/csv/${projectId}`;
    return this.http.get(url, {responseType: 'text'});
    //   .pipe(tap(
    //   data => console.log(data),
    //   error => console.log(error)
    // ));
  }
}
