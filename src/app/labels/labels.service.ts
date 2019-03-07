import {Injectable} from '@angular/core';
import {LabelPayload} from './label.payload';
import {LabelsSocket} from './labels.socket';
import {Labels} from '../interfaces/ILabels';
import {Range} from '../models/range';
import {IdType} from 'vis';
import {ProjectService} from '../editor/project.service';
import {ProjectModel} from '../models/project.model';
import {defer, Observable, Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {validate} from 'codelyzer/walkerFactory/walkerFn';

interface ILabel {
  id: string;
  name: string;
  projectId: string;
  authorId: string;
}

@Injectable({
  providedIn: 'root'
})
export class LabelsService {
  constructor(private socket: LabelsSocket) {

    this.socket.on('connect', () => {
      console.log('connect');
    });

    this.socket.on('disconnect', () => {
      console.log('disconnect');
    });
  }

  addLabel(projectId: string, authorId: string = '', callback?: Function) {
    this.socket.emit('add', {pid: projectId, aid: authorId}, callback);
  }

  private doOnSubscribe<T>(onSubscribe: () => void): (source: Observable<T>) => Observable<T> {
    return function inner(source: Observable<T>): Observable<T> {
      return defer(() => {
        onSubscribe();
        return source;
      });
    };
  }

  getLabels(projectId: string, callback?: Function) {
    this.socket.emit('all', {pid: projectId}, callback);
  }

  newLabels$(projectId: string): Observable<any> {
    return this.socket.fromEvent('new');
  }

  deleteLabel(id: string, callback?: Function) {
    this.socket.emit('del', {id}, callback);
  }

  removedLabels$(): Observable<any> {
    return this.socket.fromEvent('rem');
  }
}
