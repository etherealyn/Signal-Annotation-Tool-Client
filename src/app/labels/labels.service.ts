import { Injectable } from '@angular/core';
import { LabelPayload } from './label.payload';
import { LabelsSocket } from './labels.socket';
import { Labels } from '../interfaces/ILabels';
import { Range } from '../models/range';
import { IdType } from 'vis';
import { ProjectService } from '../editor/project.service';

@Injectable({
  providedIn: 'root'
})
export class LabelsService {

  projectId;
  constructor(private socket: LabelsSocket, private projectService: ProjectService) {
    console.log('LabelsService', 'constructor');

    this.projectService.getCurrentProject$().subscribe(project => {
      if (project) {
        this.projectId = project.id;
      }
    });

    this.socket.once('connect', () => {
      console.log('LabelsService:Socket:connect');
    });

    this.socket.once('disconnect', () => {
      console.log('LabelsService:Socket', 'disconnect', {id: this.projectId});
    });
  }
}
