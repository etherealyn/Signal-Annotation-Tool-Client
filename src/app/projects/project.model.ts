import { User } from '../auth/user.model';

export class ProjectModel {
  constructor(
    public id: string,
    public title: string,
    public modified: Date,
    public ownerId?: string,
    public description?: string,
  ) {}
}
