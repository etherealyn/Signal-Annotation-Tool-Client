import { File } from './file';

export interface Directory extends File {
  files: File[];
  expanded: boolean;
}
