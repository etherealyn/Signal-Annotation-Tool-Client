import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ProjectModel } from '../project.model';
import { ProjectsService } from '../projects.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-project-form',
  templateUrl: './project-modal.component.html',
  styleUrls: [ './project-modal.component.css' ]
})
export class ProjectModalComponent implements OnInit {
  private model = new ProjectModel('', 'My Title', new Date());

  private modalOpen = false;
  private submitted = false;

  constructor(
    private projectsService: ProjectsService,
    private router: Router) {
  }

  ngOnInit() {
  }

  onSubmit(form: FormGroup) {
    this.submitted = true;
    this.modalOpen = false;

    this.projectsService.insertProject(this.model)
      .subscribe(response => {

        if (response.result.ok === 1) {
          this.router.navigate([ `/editor/${response.id}` ]);
        } else {
          // todo: show error
          console.error(JSON.stringify(response));
        }
      });
  }
}
