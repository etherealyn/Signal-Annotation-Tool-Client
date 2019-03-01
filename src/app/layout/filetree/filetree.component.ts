import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProjectEditorService } from '../../editor/project-editor.service';
import { ProjectModel } from '../../models/project.model';
import { Subscription } from 'rxjs';
import { DirectoryModel } from '../../models/directory.model';

import { IFile } from '../../interfaces/IFile';
import { IDirectory } from '../../interfaces/IDirectory';
import { FileModel } from '../../models/file.model';
import { FileUploadComponent } from '../../upload/file-upload/file-upload.component';

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

  @ViewChild(FileUploadComponent) uploadDialog: FileUploadComponent;

  constructor(private editorService: ProjectEditorService) {
  }

  ngOnInit() {
    this.subscription = this.editorService.getCurrentProject$()
      .subscribe(value => {
        if (value && value.fileTree) {
          this.project = value;
          this.rootDirectory = this.buildFileTree(this.project.fileTree);
        }
      });
  }


  buildFileTree(fileTree: DirectoryModel): IDirectory[] {
    const filesFolder = {
      name: 'Files',
      icon: 'folder',
      expanded: true,
      files: []
    };

    /** fixme: for now support only 1-level of nesting */
    if (fileTree && fileTree.children) {
      fileTree.children.forEach(model => {
        const file: IFile = {
          name: model.name,
          filename: model.filename,
          icon: model.mimetype.startsWith('video') ? 'film-strip' : 'file',
          active: false
        };

        filesFolder.files.push(file);
        this.fileIndex.set(file.name, model);
      });
    }

    return [ filesFolder ];
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openFile(file: IFile) {
    // const fileModel = this.fileIndex.get(fileName);
    // if (fileModel.mimetype.startsWith('video')) {
    //   this.editorService.openFile(fileModel);
    // }
    file.active = !file.active;
  }

  openUploadDialog() {
    this.uploadDialog.openDialog();
  }

  onFileDelete(filename: string) {
    this.editorService.deleteFile(filename);
    console.error('FileTree.onFileDelete', 'Not Implemented'); // fixme
  }
}
