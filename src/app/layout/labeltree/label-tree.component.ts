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
import {remove} from 'typescript-collections/dist/lib/arrays';

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

  constructor(private projectService: ProjectService, private labelsService: LabelsService) {
  }

  ngOnInit() {
    this.subscription = this.projectService.getCurrentProject$()
      .subscribe(project => {
        if (project) {
          this.project = project;
          this.labelsService.getLabels().then(value =>
            this.annotationsFolder.files = value.map(label => ({id: label.id, name: label.name, icon: 'tag', active: false}))
          );
        }
      });

    this.subscription.add(this.labelsService.newLabels$().subscribe(label => {
      if (label) {
        this.annotationsFolder.files.push({id: label.id, name: label.name, icon: 'tag', active: false});
      }
    }));

    this.subscription.add(this.labelsService.removedLabels$().subscribe(e => {
      const len = this.annotationsFolder.files.length;
      const i = this.annotationsFolder.files.findIndex(x => x.id === e.id);
      if (0 <= i && i < len) {
        this.annotationsFolder.files.splice(i, 1);
      }
    }));

    this.subscription.add(this.labelsService.editedLabels$().subscribe(edit => {
      console.log(edit);
      if (edit) {
        const labelId = edit.id;
        const changeName = edit.change;
        const i = this.annotationsFolder.files.findIndex(x => x.id === labelId);
        const length = this.annotationsFolder.files.length;
        if (0 <= i && i < length) {
          this.annotationsFolder.files[i].name = changeName;
        }
      }
    }));
  }

  addNewLabel() {
    this.labelsService.addLabel('').then(
      (label: LabelModel) => {
        if (label) {
          this.annotationsFolder.files.push({id: label.id, name: label.name, icon: 'tag', active: false});
        }
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onLabelDelete(id: string) {
    this.labelsService.deleteLabel(id).then(() => {
      const len = this.annotationsFolder.files.length;
      const i = this.annotationsFolder.files.findIndex(x => x.id === id);
      if (0 <= i && i < len) {
        this.annotationsFolder.files.splice(i, 1);
      }
    });
  }

  onLabelNameChange(label: IFile) {
    this.labelsService.editLabelName(label.id, label.name)
      .then((data) => {

      });
  }
}
