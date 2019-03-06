import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class LabelsSocket extends Socket {
  constructor() {
    super({url: 'http://localhost:8080/labels', options: {}});
  }
}
