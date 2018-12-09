import {Component, OnInit} from '@angular/core';

import {Project} from '../models/Project';
import {ProjectsService} from '../services/projects.service';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  model = new Project('', 'Jump Detection', new Date());

  modalOpen = false;
  submitted = false;

  constructor(
    private projectsService: ProjectsService,
    private router: Router) {
  }

  ngOnInit() {
  }

  onSubmit(form: FormGroup) {
    this.submitted = true;
    this.modalOpen = false;
    // todo: send new project to the backend
    this.projectsService.insertProject(this.model);
    // todo: get unique id for this project
    form.reset();
    // todo: redirect the user to a new project page
    this.router.navigate(['/editor']);
  }

  // TODO: Remove this when done
  get disagnostic() {
    return JSON.stringify(this.model);
  }
}
