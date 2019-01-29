import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { MatGridListModule} from '@angular/material';
import { ClarityModule } from '@clr/angular';
import { AppRouting } from '../app.routing';
import { EditorComponent } from './editor.component';
import { UploadModule } from '../upload/upload.module';

import { VideoComponent } from './video/video.component';
import { VideogridComponent } from './videogrid/videogrid.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [ EditorComponent, VideoComponent, VideogridComponent ],
  imports: [
    CommonModule,
    FormsModule,
    AppRouting,
    ClarityModule,
    UploadModule,
    MatGridListModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ]
})
export class EditorModule {
}
