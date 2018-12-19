import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProjectsComponent } from './projects/projects.component';
import { EditorComponent } from './editor/editor.component';


const appRoutes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: 'projects', component: ProjectsComponent },
  { path: 'editor/:id', component: EditorComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(
    appRoutes,
    {
      enableTracing: false // todo: remove
    }
  ) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
