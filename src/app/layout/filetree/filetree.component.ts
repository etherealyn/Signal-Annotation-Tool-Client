import { Component, OnDestroy, OnInit } from '@angular/core';
import { EditorService } from '../../editor/editor.service';
import { ProjectModel } from '../../models/project.model';
import { Subscription } from 'rxjs';
import { DirectoryModel } from '../../models/directory.model';

import { IFile } from './file';
import { IDirectory } from './directory';
import { FileModel } from '../../models/file.model';

@Component({
  selector: 'app-filetree',
  templateUrl: './filetree.component.html',
  styleUrls: [ './filetree.component.scss' ]
})
export class FiletreeComponent implements OnInit, OnDestroy {

  project: ProjectModel;
  private subscription: Subscription;

  rootDirectory: IDirectory[] = [];
  fileIndex = new Map<string, FileModel>();

  constructor(private editorService: EditorService) {
  }

  ngOnInit() {
    this.subscription = this.editorService.getCurrentProject$()
      .pipe()
      .subscribe(value => {
        if (value && value.fileTree) {
          this.project = value;
          this.rootDirectory = this.buildFileTree(this.project.fileTree);
        }
      });
  }

  buildFileTree(fileTree: DirectoryModel ): IDirectory[] {
    if (fileTree.children) {
      const files = [];

      fileTree.children.forEach(model => {
        const file: IFile = {
          name: model.name,
          icon: model.mimetype.startsWith('video') ? 'film-strip' : 'file',
          active: false
        };

        files.push(file);
        this.fileIndex.set(file.name, model);
      });

      return [
        {
          name: 'Files',
          icon: 'folder',
          expanded: true,
          files: files
        },
      ];
    }
    return [];
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openFile(directoryName: string, fileName: string) {
    console.log(directoryName, fileName);
    const fileModel = this.fileIndex.get(fileName);

    if (fileModel.mimetype.startsWith('video')) {
      this.editorService.openFile(fileModel);
    }
  }
}
