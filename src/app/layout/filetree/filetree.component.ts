import { Component, OnDestroy, OnInit } from '@angular/core';
import { EditorService } from '../../editor/editor.service';
import { ProjectModel } from '../../models/project.model';
import { Subscription } from 'rxjs';
import { DirectoryModel } from '../../models/directory.model';
import { File } from './file';
import { Directory } from './directory';

@Component({
  selector: 'app-filetree',
  templateUrl: './filetree.component.html',
  styleUrls: [ './filetree.component.css' ]
})
export class FiletreeComponent implements OnInit, OnDestroy {

  private project: ProjectModel;
  private subscription: Subscription;

  rootDirectory: Directory[] = [];

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

  buildFileTree(fileTree: DirectoryModel ): Directory[] {
    if (fileTree.children) {
      const files = [];

      fileTree.children.forEach(value => {
        const file: File = {
          name: value.name,
          icon: value.mimetype.startsWith('video') ? 'film-strip' : 'file',
          active: false,
        };

        files.push(file);
      });


      return [
        {
          name: this.project.title,
          icon: 'folder',
          expanded: true,
          files: files
        },
      ];
    }
    return [];
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openFile(directoryName: string, fileName: string) {
    console.log(directoryName, fileName);
  }
}
