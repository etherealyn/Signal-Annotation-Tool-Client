import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRouting } from '../app.routing';
import { ClarityModule } from '@clr/angular';

import { HeaderComponent } from './header/header.component';

import { LayoutComponent } from './layout/layout.component';
import { FiletreeComponent } from './filetree/filetree.component';
import { UploadModule } from '../upload/upload.module';

import { LabelTreeComponent } from './labeltree/label-tree.component';


@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    AppRouting,
    UploadModule
  ],
  exports: [
    LayoutComponent,
  ],
  declarations: [ HeaderComponent,
    LayoutComponent,
    FiletreeComponent,
    LabelTreeComponent,
  ]
})
export class LayoutModule {
}
