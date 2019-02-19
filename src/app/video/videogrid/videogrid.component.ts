import { Component, OnInit } from '@angular/core';
import { VgAPI } from 'videogular2/core';
import { IVideo } from '../video.interface';
import { ProjectEditorService } from '../../editor/project-editor.service';
import { LinkedList } from 'typescript-collections';
import { IMediaSubscriptions } from 'videogular2/src/core/vg-media/i-playable';

@Component({
  selector: 'app-videogrid',
  templateUrl: './videogrid.component.html',
  styleUrls: [ './videogrid.component.scss' ]
})
export class VideogridComponent implements OnInit {
  currentTime = 0;

  private _videoSources: IVideo[] = [];
  private apis: LinkedList<VgAPI> = new LinkedList<VgAPI>();

  private cursorSound = true;

  private guard = 0;
  private isPlaying = false;

  private progressDelayMilli = 50;
  private lastMouseLeft = 0;

  private playbackIndex = 3;
  private playbackValues: string[] = [ '0.25', '0.5', '0.75', '1.0', '1.25', '1.50', '1.75', '2.0', '3.0', '4.0', ];

  private subscription;
  private timeUpdateSubscription;


  constructor(private projectEditorService: ProjectEditorService) {

  }

  ngOnInit() {
    this.subscription = this.projectEditorService.getCurrentProject$().subscribe(project => {
      if (project) {
        /** Gather all videoSources */
        const videos: IVideo[] = [];
        project.fileTree.children.forEach((child => {
          if (child.mimetype.startsWith('video')) {
            videos.push({ source: child.filename });
          }
        }));

        this._videoSources = videos;
      }
    });
  }

  private onPlayerReady(api: VgAPI) {
    this.apis.add(api);

    if (this.timeUpdateSubscription) {

    } else {
      const mediaSubscriptions: IMediaSubscriptions = this.apis.first().subscriptions;
      this.timeUpdateSubscription = mediaSubscriptions.timeUpdate.subscribe(() => {
        this.currentTime = this.apis.first().currentTime;
      });
    }
  }

  /** Mouse Event Reactions  START */

  onMouseEnter(i: number) {
    if (this.cursorSound) {
      this.apis.elementAtIndex(i).volume = 1;
    }
  }

  onMouseLeave(i: number) {
    if (this.cursorSound) {
      this.apis.elementAtIndex(i).volume = 0;
      this.lastMouseLeft = i;
    }
  }

  onGlobalMouseLeave() {
    if (this.cursorSound) {
      const api: VgAPI = this.apis.elementAtIndex(this.lastMouseLeft);
      api.volume = 1;
    }
  }

  /** Mouse Event Reactions END */


  /** Video Controls START */

  seekTime(value) {
    if (this.guard % 2 === 0) {
      /** This funny logic is due to a bug on Webkit-based browsers, leading to change firing twice */
      this.guard += 1;
      this.apis.forEach((api: VgAPI) => {
        api.seekTime(value);
      });
    } else {
      this.guard = 0;
    }
  }

  onPlayPause() {
    if (!this.isPlaying) {
      this.onPlay();
    } else {
      this.onPause();
    }
  }

  onPlay() {
    if (this.apis) {
      this.apis.forEach((api: VgAPI) => {
        api.play();
      });
      this.isPlaying = true;
    }
  }

  onPause() {
    this.apis.forEach((api: VgAPI) => {
      api.pause();
    });
    this.isPlaying = false;
  }


  nextPlaybackSpeed() {
    this.playbackIndex = (this.playbackIndex + 1) % this.playbackValues.length;
    this.apis.forEach((api: VgAPI) => {
      api.playbackRate = (this.playbackValues[this.playbackIndex]);
    });
  }

  getPlaybackValue() {
    return this.playbackValues[this.playbackIndex];
  }

  /** Video Controls END*/

  get videoSources(): IVideo[] {
    return this._videoSources;
  }

  get duration(): number {
    const first = this.apis.first();
    if (first) {
      return first.duration;
    }
  }
}
