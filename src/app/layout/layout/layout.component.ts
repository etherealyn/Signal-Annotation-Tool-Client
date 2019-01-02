import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styles: []
})
export class LayoutComponent implements OnInit, OnDestroy {
  private hidden = false;
  private user: User;

  private subscription: Subscription;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.subscription = this.authService.currentSession.subscribe(
      x => {
        if (x && x.user) {
          this.user = x.user;
        }
        this.hidden = !x;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
