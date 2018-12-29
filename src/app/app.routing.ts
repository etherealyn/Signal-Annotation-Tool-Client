import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProjectsComponent } from './projects/projects.component';
import { EditorComponent } from './editor/editor.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';


const appRoutes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: 'auth', component: LoginComponent },
  // { path: 'register', component: LoginComponent },
  { path: 'projects', component: ProjectsComponent, canActivate: [ AuthGuard ] },
  { path: 'editor/:id', component: EditorComponent, canActivate: [ AuthGuard ] },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [ RouterModule.forRoot(
    appRoutes,
    {
      enableTracing: false
    }
  ) ],
  exports: [ RouterModule ]
})
export class AppRouting {
}
