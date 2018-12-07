import {Component, OnInit} from '@angular/core';

import {Project} from '../models/Project';
import {ProjectsService} from '../services/projects.service';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  model = new Project(42, 'Jump Detection', '', new Date());

  modalOpen = true;
  submitted = false;

  constructor(private projectsService: ProjectsService) {
  }

  ngOnInit() {
  }

  onSubmit(form: FormGroup) {
    this.submitted = true;
    this.modalOpen = false;
    console.log('onSubmit()');
    console.log(this.disagnostic);
    // todo: send new project to the backend
    this.projectsService.insertProject(this.model);
    form.reset();
    // todo: redirect the user to a new project page
  }

  // TODO: Remove this when done
  get disagnostic() {
    return JSON.stringify(this.model);
  }

}
