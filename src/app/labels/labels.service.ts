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
    this.socket.on('connect', () => {
      console.log('connect');
    });

    this.socket.on('disconnect', () => {
      console.log('disconnect');
    });
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

  getLabels(): Promise<LabelModel[]> {
    return new Promise((resolve) => {
      this.socket.emit('all', undefined, (value) => resolve(value));
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

  async editLabelName(id: string, change: string) {
    return await new Promise(((resolve, reject) => {
      console.log('editLabelName');
      this.socket.emit('edit', {id, change}, (err) => {
        if (!err) {
          resolve({id, change});
        } else {
          reject();
        }
      });
    }));
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

  newLabels$ = (): Observable<any> => this.socket.fromEvent('new');

  removedLabels$ = (): Observable<any> => this.socket.fromEvent('rem');

  editedLabels$ = (): Observable<any> => this.socket.fromEvent('upd');
}
