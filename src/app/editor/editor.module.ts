import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { AppRouting } from '../app.routing';

import { EditorComponent } from './editor.component';

@NgModule({
  declarations: [ EditorComponent ],
  imports: [
    CommonModule,
    AppRouting,
    ClarityModule
  ]
})
export class EditorModule {
}
