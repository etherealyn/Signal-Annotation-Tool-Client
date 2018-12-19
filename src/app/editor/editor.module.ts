import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { AppRoutingModule } from '../app-routing.module';

import { EditorComponent } from './editor.component';

@NgModule({
  declarations: [ EditorComponent ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ClarityModule
  ]
})
export class EditorModule {
}
