import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { AppRouting } from '../app.routing';

import { EditorComponent } from './editor.component';
import { UploadModule } from '../upload/upload.module';

@NgModule({
  declarations: [ EditorComponent ],
  imports: [
    CommonModule,
    AppRouting,
    ClarityModule,
    UploadModule
  ]
})
export class EditorModule {
}
