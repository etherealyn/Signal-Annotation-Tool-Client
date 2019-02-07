import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { MatGridListModule } from '@angular/material';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { AngularSplitModule } from 'angular-split';

import { AppRouting } from '../app.routing';
import { EditorComponent } from './editor.component';
import { UploadModule } from '../upload/upload.module';
import { VideoComponent } from './video/video.component';
import { VideogridComponent } from './videogrid/videogrid.component';
import { RecorderComponent } from './recorder/recorder.component';
import { TimelineComponent } from './timeline/timeline.component';

@NgModule({
  declarations: [ EditorComponent, VideoComponent, VideogridComponent, RecorderComponent, TimelineComponent ],
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
    VgBufferingModule,
    AngularSplitModule.forRoot()
  ]
})
export class EditorModule {
}
