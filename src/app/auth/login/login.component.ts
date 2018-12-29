import { Component, OnInit } from '@angular/core';

import { AuthModel } from '../auth.model';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, first } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {
  authModel = new AuthModel('', '', true);
  returnUrl: string;
  loading = false;
  error = false;

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate([ '/projects' ]);
    }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    // todo: add form validation

    // this.loading = true;
    this.error = false;

    this.authService.login(this.authModel.username, this.authModel.password)
      .subscribe(
        data => {
          if (data) {
            this.router.navigate([ this.returnUrl ]);
          } else {
            this.error = true;
          }
        });
  }
}
