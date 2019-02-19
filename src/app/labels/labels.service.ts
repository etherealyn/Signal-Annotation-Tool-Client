import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { LabelPayload } from './label.payload';
import { LabelModel } from '../models/label.model';

interface Labels {
  projectId: string;
  labels: LabelModel[];
}

@Injectable({
  providedIn: 'root'
})
export class LabelsService {

  constructor(private socket: Socket) {

    this.socket.on('connect', () => {
      console.log('Connected');
    });

    this.socket.on('addLabel', data => {
      console.log('addLabel', data);
    });

    this.socket.on('editLabel', data => {
      console.log('editLabel', data);
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

  editLabelName(payload: LabelPayload) {
    this.socket.emit('editLabel', payload);
  }

  deleteLabel(projectId: string, index: number) {
    this.socket.emit('deleteLabel', {projectId, index});
  }
}
