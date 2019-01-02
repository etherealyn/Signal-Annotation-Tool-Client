import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Session } from '../../auth/session.model';
import { User } from '../../auth/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit, OnDestroy {
  private isProjectActive = true;
  private isEditorActive = false;
  private isHeaderVisible = false;

  private user: User;
  private subscription: Subscription;

  constructor(private router: Router,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.subscription = this.router.events.subscribe((event: RouterEvent) => {
      const url: string = event.url;
      if (url) {
        if (url.startsWith('/project')) {
          this.isProjectActive = true;
          this.isEditorActive = false;
        } else if (url.startsWith('/editor')) {
          this.isProjectActive = false;
          this.isEditorActive = true;
        }
      }
    });

    this.subscription.add(
      this.authService.currentSession.subscribe((x: Session) => {
        if (x && x.user) {
          this.user = x.user;
        }
        this.isHeaderVisible = !x;
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  onLogout() {
    this.authService.logout();
    this.router.navigate([ '/auth' ]);
  }
}
