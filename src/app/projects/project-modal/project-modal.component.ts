import {Component, OnInit} from '@angular/core';

import {Project} from '../../models/Project';
import {ProjectsService} from '../projects.service';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-modal.component.html',
  styleUrls: ['./project-modal.component.css']
})
export class ProjectModalComponent implements OnInit {
  model = new Project('', 'My Title', new Date());

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

    this.projectsService.insertProject(this.model)
      .subscribe(response => {

        if (response.result.ok === 1) {
          this.router.navigate([`/editor/${response.id}`]);
        } else {
          // todo: show error
          console.error(JSON.stringify(response));
        }
      });
    // form.reset();
    // this.router.navigate(['/editor']);
  }

  // TODO: Remove this when done
  get disagnostic() {
    return JSON.stringify(this.model);
  }
}
