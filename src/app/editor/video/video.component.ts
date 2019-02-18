import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { VgAPI } from 'videogular2/core';
import { Subscription } from 'rxjs';
import { ProjectsService } from '../../projects/projects.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: [ './video.component.scss' ]
})
export class VideoComponent implements OnInit {
  @Input() source: String;
  @Output() playerReady: EventEmitter<any> = new EventEmitter();

  api: VgAPI;
  url: String;

  duration = 0;

  private subscription: Subscription;

  constructor(private projectsService: ProjectsService) {
    this.url = `${projectsService.projectsUrl}/files`;
  }

  ngOnInit() {
  }

  onPlayerReady$(api: VgAPI) {
    this.api = api;
    this.playerReady.emit(api);

    this.subscription = api.subscriptions.durationChange.subscribe(() => {
      this.duration = api.duration;
    });
  }
}
