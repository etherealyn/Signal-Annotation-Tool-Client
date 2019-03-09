import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectModel } from '../models/project.model';
import { ProjectService } from './project.service';
import { VgAPI } from 'videogular2/core';
import {LabelsService} from '../labels/labels.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: [ './editor.component.scss' ]
})
export class EditorComponent implements OnInit, OnDestroy {
  direction = 'horizontal';
  projectId: string;
  constructor(private route: ActivatedRoute,
              private projectService: ProjectService,
              private labelService: LabelsService) {
  }

  ngOnInit() {
    /** Get project id from the current route */
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.projectService.loadProject(this.projectId);
    this.labelService.joinProject(this.projectId);
  }

  ngOnDestroy(): void {
    this.labelService.leaveProject(this.projectId);
  }
}
