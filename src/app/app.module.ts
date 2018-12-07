import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {ClarityModule} from '@clr/angular';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ProjectsComponent} from './projects/projects.component';
import {LayoutModule} from './layout/layout.module';
import {EditorComponent} from './editor/editor.component';
import {ProjectFormComponent} from './project-form/project-form.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    EditorComponent,
    ProjectFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ClarityModule,
    LayoutModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
