import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ProjectsComponent} from './projects/projects.component';
import {EditorComponent} from './editor/editor.component';


const appRoutes: Routes = [
  {path: '', redirectTo: '/projects', pathMatch: 'full'},
  {path: 'projects', component: ProjectsComponent},
  {path: 'editor', component: EditorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(
    appRoutes,
    {enableTracing: true}
  )],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
