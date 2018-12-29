import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthModel } from './auth.model';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {
  private authModel = new AuthModel('', '', true);

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate([ '/projects' ]);
    }
  }

  onSubmit() {
    // todo: add form validation

    this.authService.login(this.authModel.username, this.authModel.password)
      .subscribe(value => {
        if (value) {
          console.log(value);
          this.router.navigate([ '/projects' ]);
        }
      });
  }
}
