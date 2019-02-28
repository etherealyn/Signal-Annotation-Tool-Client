import { Injectable } from '@angular/core';
import { LabelPayload } from './label.payload';
import { LabelModel } from '../models/label.model';
import { LabelsSocket } from './labels.socket';

interface Labels {
  projectId: string;
  labels: LabelModel[];
}

@Injectable({
  providedIn: 'root'
})
export class LabelsService {

  constructor(private socket: LabelsSocket) {

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
}
