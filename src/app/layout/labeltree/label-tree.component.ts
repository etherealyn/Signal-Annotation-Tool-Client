import {Component, OnDestroy, OnInit} from '@angular/core';
import {IDirectory} from '../../interfaces/IDirectory';
import {LabelsService} from '../../labels/labels.service';
import {ProjectService} from '../../editor/project.service';
import {Subscription} from 'rxjs';
import {ProjectModel} from '../../models/project.model';
import {filter, map} from 'rxjs/operators';
import {IFile} from '../../interfaces/IFile';
import * as Collections from 'typescript-collections';
import {LabelModel} from '../../models/label.model';

@Component({
  selector: 'app-label-tree',
  templateUrl: './label-tree.component.html',
  styleUrls: ['./label-tree.component.scss']
})
export class LabelTreeComponent implements OnInit, OnDestroy {
  annotationsFolder: IDirectory = {
    name: 'Labels',
    icon: 'folder',
    expanded: true,
    files: []
  };

  private project: ProjectModel;
  private subscription: Subscription;

  constructor(
    private projectService: ProjectService,
    private labelsService: LabelsService) {
  }

  ngOnInit() {
    this.subscription = this.projectService.getCurrentProject$()
      .subscribe(project => {
        if (project) {
          this.project = project;
          this.onProjectReady(project);
        }
      });
  }

  private onProjectReady(project: ProjectModel) {
    this.labelsService.getLabels(project.id, xs => {
      this.annotationsFolder.files = xs.map(label => ({
        id: label.id,
        name: label.name,
        icon: 'tag',
        active: false,
      }));
    });

    this.subscription.add(
      this.labelsService.newLabels$(project.id)
        .subscribe(label => {
          if (label) {
            this.annotationsFolder.files.push({
              id: label.id,
              name: label.name,
              icon: 'tag',
              active: false,
            });
          }
        })
    );

    this.subscription.add(
      this.labelsService.removedLabels$()
        .subscribe(data => {
          console.log('rem', data.id);
          const len = this.annotationsFolder.files.length;
          const i = this.annotationsFolder.files.findIndex(x => x.id === data.id);
          if (0 <= i && i < len) {
            this.annotationsFolder.files.splice(i, 1);
          }
        })
    );
  }

  addNewLabel() {
    this.labelsService.addLabel(this.project.id, '', label => {
      this.annotationsFolder.files.push({
        id: label.id,
        name: label.name,
        icon: 'tag',
        active: false,
      });
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onLabelDelete(i: number, id: string) {
    this.labelsService.deleteLabel(id, result => {
      if (result) {
        this.annotationsFolder.files.splice(i, 1);
      }
    });
  }
}
