import { Component, OnInit, ViewChild } from '@angular/core';
import { UploadService } from '../upload.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: [ './dialog.component.css' ]
})
export class DialogComponent implements OnInit {
  @ViewChild('file') file;
  public files: Set<File> = new Set();
  opened: boolean;
  progress;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  constructor(private uploadService: UploadService) {
  }

  ngOnInit() {
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (const key in files) {
      if (!isNaN(parseInt(key, 10))) {
        this.files.add(files[key]);
      }
    }
  }

  openDialog() {
    this.openModal();
  }

  private openModal() {
    this.opened = true;
  }

  closeDialog() {
    if (this.uploadSuccessful) {
      this.reset();
      this.closeModal();
      return;
    }

    this.uploading = true;
    this.progress = this.uploadService.uploadToProject(this.files);

    const allProgressObservables = [];
    for (const key in this.progress) {
      if (this.progress.hasOwnProperty(key)) {
        allProgressObservables.push(this.progress[key].progress);
      }
    }

    this.primaryButtonText = 'Finish';
    this.canBeClosed = false;
    this.showCancelButton = false;

    forkJoin(allProgressObservables).subscribe(() => {
      this.canBeClosed = true;
      this.showCancelButton = false;
      // this.opened = false;

      this.uploadSuccessful = true;
      this.uploading = false;
    });
  }

  onCancel() {
    this.reset();
    this.closeModal();
  }

  private closeModal() {
    this.opened = false;
  }

  private reset() {
    this.files.clear();
    this.progress = null; // fixme: memory leak?
    this.uploadSuccessful = false;
  }
}
