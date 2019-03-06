import { Component, OnInit } from '@angular/core';
import { IDirectory } from '../../interfaces/IDirectory';
import { LabelsService } from '../../labels/labels.service';
import { AuthService } from '../../auth/auth.service';
import { ProjectService } from '../../editor/project.service';
import { LabelModel } from '../../models/label.model';
import { Subscription } from 'rxjs';
import { ProjectModel } from '../../models/project.model';

@Component({
  selector: 'app-label-tree',
  templateUrl: './label-tree.component.html',
  styleUrls: [ './label-tree.component.scss' ]
})
export class LabelTreeComponent implements OnInit {

  annotationsFolder: IDirectory = {
    name: 'Labels',
    icon: 'folder',
    expanded: true,
    files: []
  };

  constructor(private labelsService: LabelsService) {
  }

  ngOnInit() {
    console.log('LabelTreeComponent', 'onInit');
    // this.subscription.add(this.labelService.getLabels$().subscribe(value => {
    //   const projectId = value.projectId;
    //   const labels = value.labels;
    //   if (this.project.id === projectId) {
    //     this.annotationsFolder = this.buildAnnotationsTree(labels);
    //   }
    // }));
  }

  initFolder(labelGroups: LabelModel[]) {
    if (labelGroups) {
      labelGroups.forEach(model => {
        this.annotationsFolder.files.push({
          id: model.id,
          name: model.name,
          icon: 'tag',
          active: false
        });
      });
    }
  }

  addNewLabel() {
    console.log('LabelTreeComponent', 'add new label');
    // const name = `Label ${this.annotationsFolder.files.length + 1}`;

    // const projectId = this.project.id;
    // const authorId = this.authService.currentUserValue.id;
    //
    // this.labelService.addLabel({ projectId, authorId, name });
  }

  onLabelDelete(labelId: string, index: number) {
    console.log('LabelTreeComponent', 'label delete', labelId, index);
    //   this.labelService.deleteLabel(this.project.id, labelId);
    //   this.annotationsFolder.files.splice(index, 1);
  }

  onLabelNameChange(i: number) {
    console.log('LabelTreeComponent', 'label edit');
    //   const label = this.annotationsFolder.files[i];
    //   if (label) {
    //     this.labelService.editLabelName(this.project.id, label.id, label.name);
  }
}
