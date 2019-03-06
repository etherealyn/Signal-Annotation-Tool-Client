import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectModel } from '../models/project.model';
import { ProjectService } from './project.service';
import { VgAPI } from 'videogular2/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: [ './editor.component.scss' ]
})
export class EditorComponent implements OnInit {
  direction = 'horizontal';

  constructor(private route: ActivatedRoute,
              private editorService: ProjectService) {
  }

  ngOnInit() {
    /** Get project id from the current route */
    const projectId = this.route.snapshot.paramMap.get('id');
    this.editorService.loadProject(projectId);
  }
}
