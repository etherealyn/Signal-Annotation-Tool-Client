import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';

import { ClarityModule } from '@clr/angular';
import { AppRouting } from '../app.routing';
import { EditorComponent } from './editor.component';
import { UploadModule } from '../upload/upload.module';

import { VideoComponent } from './video/video.component';

@NgModule({
  declarations: [ EditorComponent, VideoComponent ],
  imports: [
    CommonModule,
    AppRouting,
    ClarityModule,
    UploadModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ]
})
export class EditorModule {
}
