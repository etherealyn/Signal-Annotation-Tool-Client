import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { LabelPayload } from './label.payload';

@Injectable({
  providedIn: 'root'
})
export class LabelsService {

  constructor(private socket: Socket) {
    this.socket.fromEvent('addLabel').subscribe(value => console.log(value));

    this.socket.on('connect', function () {
      console.log('Connected');
    });

    this.socket.on('addLabel', function (data) {
      console.log('addLabel', data);
    });

    this.socket.on('editLabel', function (data) {
      console.log('editLabel', data);
    });

    this.socket.on('disconnect', function () {
      console.log('Disconnected');
    });
  }

  addLabel(payload: LabelPayload) {
    this.socket.emit('addLabel', payload);
  }

  editLabelName(payload: LabelPayload) {
    this.socket.emit('editLabel', payload);
  }

  deleteLabel(labelId: string) {
    this.socket.emit('deleteLabel', labelId);
  }
}
