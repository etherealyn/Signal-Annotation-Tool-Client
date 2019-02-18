import { DirectoryModel } from './directory.model';
import { LabelModel } from './label.model';
import { UserModel } from './user.model';

export class ProjectModel {
  constructor(
    public id: string,
    public title: string,
    public modified: Date,
    public ownerId?: string,
    public memberIds?: string[],
    public description?: string,
    public fileTree?: DirectoryModel,
    public labels?: LabelModel[],
  ) {}
}
