import { Component, OnInit } from '@angular/core';
import { IDirectory } from '../../interfaces/directory';
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
export class LabelTreeComponent implements OnInit {

  project: ProjectModel;
  annotationsFolder: IDirectory;

  private subscription;

  constructor(private editorService: ProjectEditorService,
              private authService: AuthService,
              private labelService: LabelsService) {
  }

  ngOnInit() {
    this.subscription = this.editorService.getCurrentProject$()
      .subscribe(value => {
        if (value) {
          this.project = value;
          this.annotationsFolder = this.buildAnnotationsTree(this.project.labels);
        }
      });
  }

  buildAnnotationsTree(classes: LabelModel[]) {
    const annotationsFolder: IDirectory = {
      name: 'Labels',
      icon: 'folder',
      expanded: true,
      files: []
    };
    if (classes) {
      classes.forEach(model => {
        annotationsFolder.files.push({
          name: model.name,
          icon: 'tag',
          active: false
        });
      });
    }
    return annotationsFolder;
  }

  addNewLabel() {
    const index = this.annotationsFolder.files.length + 1;
    const name = `Label ${index}`;

    const projectId = this.project.id;
    const authorId = this.authService.currentUserValue.id;

    this.labelService.addLabel({ projectId, authorId, name });

    this.annotationsFolder.files.push({ name: name, icon: 'tag', active: false });
  }

  onLabelDelete(i: number) {

    // this.labelService.deleteLabel(labelId);

    this.annotationsFolder.files.splice(i, 1);
  }

  onLabelHide(i: number) {
    // this.annotationsFolder.files[i].hidden = !this.annotationsFolder.files[i].hidden;
  }
}
