import { IFile } from './file';

export interface IDirectory extends IFile {
  files: IFile[];
  expanded: boolean;
}
