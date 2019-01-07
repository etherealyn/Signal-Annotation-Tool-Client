import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClarityModule } from '@clr/angular';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from './dialog/dialog.component';
import { UploadService } from './upload.service';


@NgModule({
  declarations: [ DialogComponent ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ClarityModule,
    HttpClientModule
  ],
  entryComponents: [ DialogComponent],
  exports: [ DialogComponent ],
  providers: [ UploadService]
})
export class UploadModule {
}
