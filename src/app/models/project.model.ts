import { DirectoryModel } from './directory.model';
import { AnnotationClass } from './annotation-class.model';

export class ProjectModel {
  constructor(
    public id: string,
    public title: string,
    public modified: Date,
    public ownerId?: string,
    public description?: string,
    public fileTree?: DirectoryModel,
    public annotationClasses?: AnnotationClass[],
  ) {}
}
