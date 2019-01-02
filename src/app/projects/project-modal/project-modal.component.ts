import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ProjectModel } from '../project.model';
import { ProjectsService } from '../projects.service';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-project-form',
  templateUrl: './project-modal.component.html',
  styleUrls: [ './project-modal.component.css' ]
})
export class ProjectModalComponent implements OnInit {
  private model;

  private modalOpen = false;
  private submitted = false;

  constructor(
    private projectsService: ProjectsService,
    private router: Router,
    private authService: AuthService) {
  }

  ngOnInit() {
    const currentUserId = this.authService.currentUserValue.id;
    this.model = new ProjectModel('', '', new Date(), [ currentUserId ]);
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
