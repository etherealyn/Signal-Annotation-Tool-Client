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
import {LabelModel} from '../models/label.model';

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
    // this.socket.on('connect', () => {
    //   console.log('connect');
    // });
    //
    // this.socket.on('disconnect', () => {
    //   console.log('disconnect');
    // });
  }

  join(id) {
    this.socket.emit('join', {id}, (data) => {
      console.log(`join:${id}`, data);
    });
  }

  leave(id) {
    this.socket.emit('leave', {id}, (data) => {
      console.log(`leave:${id}`, data);
    });
  }

  addLabel(authorId: string = '') {
    return new Promise(resolve => {
      this.socket.emit('add', {aid: authorId}, (label: LabelModel) => {
        console.log('add new label', label);
        resolve(label);
      });
    });
  }

  private doOnSubscribe<T>(onSubscribe: () => void): (source: Observable<T>) => Observable<T> {
    return function inner(source: Observable<T>): Observable<T> {
      return defer(() => {
        onSubscribe();
        return source;
      });
    };
  }

  getLabels(): Promise<LabelModel[]> {
    return new Promise((resolve) => {
      this.socket.emit('all', undefined, (value) => resolve(value));
    });
  }

  newLabels$(): Observable<any> {
    return this.socket.fromEvent('new');
  }

  deleteLabel(id: string) {
    return new Promise((resolve, reject) => {
      this.socket.emit('del', {id}, (err) => {
        if (!err) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  removedLabels$(): Observable<any> {
    return this.socket.fromEvent('rem');
  }
}
