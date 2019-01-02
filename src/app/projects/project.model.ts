import { User } from '../auth/user.model';

export class ProjectModel {
  constructor(
    public id: string,
    public title: string,
    public modified: Date,
    public userIds: string[],
    public description?: string,
  ) {}
}
