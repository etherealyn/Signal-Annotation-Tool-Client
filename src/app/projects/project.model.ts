export class ProjectModel {
  constructor(
    public id: string,
    public title: string,
    public modified: Date,
    public description?: string,
  ) {}
}
