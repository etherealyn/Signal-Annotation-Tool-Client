import { Component, OnInit } from '@angular/core';
import { IDirectory } from '../../interfaces/IDirectory';
import { LabelModel } from '../../models/label.model';
import { ProjectModel } from '../../models/project.model';
import { ProjectEditorService } from '../../editor/project-editor.service';

import { AuthService } from '../../auth/auth.service';
import { LabelsService } from '../../labels/labels.service';

@Component({
  selector: 'app-label-tree',
  templateUrl: './label-tree.component.html',
  styleUrls: [ './label-tree.component.scss' ]
})
export class LabelTreeComponent  {

  // project: ProjectModel;
  // annotationsFolder: IDirectory;
  //
  // private subscription;
  //
  // constructor(private editorService: ProjectEditorService,
  //             private authService: AuthService,
  //             private labelService: LabelsService) {
  // }
  //
  // ngOnInit() {
  //   this.subscription = this.editorService.getCurrentProject$()
  //     .subscribe(value => {
  //       if (value) {
  //         this.project = value;
  //         this.annotationsFolder = this.buildAnnotationsTree(this.project.labels);
  //       }
  //     });
  //
  //   this.subscription.add(this.labelService.getLabels$().subscribe(value => {
  //     const projectId = value.projectId;
  //     const labels = value.labels;
  //     if (this.project.id === projectId) {
  //       this.annotationsFolder = this.buildAnnotationsTree(labels);
  //     }
  //   }));
  // }
  //
  // buildAnnotationsTree(classes: LabelModel[]) {
  //   const annotationsFolder: IDirectory = {
  //     name: 'Labels',
  //     icon: 'folder',
  //     expanded: true,
  //     files: []
  //   };
  //   if (classes) {
  //     classes.forEach(model => {
  //       annotationsFolder.files.push({
  //         id: model.id,
  //         name: model.name,
  //         icon: 'tag',
  //         active: false
  //       });
  //     });
  //   }
  //   return annotationsFolder;
  // }
  //
  // addNewLabel() {
  //   const index = this.annotationsFolder.files.length + 1;
  //   const name = `Label ${index}`;
  //
  //   const projectId = this.project.id;
  //   const authorId = this.authService.currentUserValue.id;
  //
  //   this.labelService.addLabel({ projectId, authorId, name });
  //
  //   // this.annotationsFolder.files.push({ name: name, icon: 'tag', active: false });
  // }
  //
  // onLabelDelete(labelId: string, index: number) {
  //   console.log('label delete', labelId, index);
  //   this.labelService.deleteLabel(this.project.id, labelId);
  //   this.annotationsFolder.files.splice(index, 1);
  // }
  //
  // onLabelNameChange(i: number) {
  //   const label = this.annotationsFolder.files[i];
  //   if (label) {
  //     this.labelService.editLabelName(this.project.id, label.id, label.name);
  //   }
  // }
}
