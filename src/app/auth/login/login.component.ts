import { Component, OnDestroy, OnInit } from '@angular/core';

import { UserAuthorization } from '../../models/user.authorization.model';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit, OnDestroy {
  authModel = new UserAuthorization('', '', true);
  returnUrl: string;
  loading = false;
  error = false;

  private subscription: Subscription;

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

    this.subscription = this.authService.login(this.authModel.username, this.authModel.password)
      .subscribe(
        data => {
          if (data) {
            this.router.navigate([ this.returnUrl ]);
          } else {
            this.error = true;
          }
        });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
