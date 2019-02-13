import { Component, OnInit, ViewChild } from '@angular/core';
import { IDirectory } from '../../interfaces/directory';
import { LabelModel } from '../../models/label.model';
import { ProjectModel } from '../../models/project.model';
import { EditorService } from '../../editor/editor.service';

@Component({
  selector: 'app-label-tree',
  templateUrl: './label-tree.component.html',
  styleUrls: ['./label-tree.component.scss']
})
export class LabelTreeComponent implements OnInit {

  project: ProjectModel;
  annotationsFolder: IDirectory;

  private subscription;

  constructor(private editorService: EditorService) { }

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
    this.annotationsFolder.files.push({
      name: name,
      icon: 'tag',
      active: false
    });

    this.editorService.addLabel(name);
  }

  onLabelDelete(i: number) {
    this.annotationsFolder.files.splice(i, 1);
  }

  onLabelHide(i: number) {
    // this.annotationsFolder.files[i].hidden = !this.annotationsFolder.files[i].hidden;
  }
}
