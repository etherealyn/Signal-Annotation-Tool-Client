import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/user.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styles: []
})
export class LayoutComponent implements OnInit {
  private hidden = false;
  private user: User;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.currentSession.subscribe(
      x => {
        if (x && x.user) {
          this.user = x.user;
        }
        this.hidden = !x;
      }
    );
  }
}
