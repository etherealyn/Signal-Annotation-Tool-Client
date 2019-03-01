import { Range } from './range';
import { RecordingEventType } from './recording.event.type';
import { RangeModel } from './range.model';

export class RecordingEvent {
  eventType: RecordingEventType;
  labelId: string;
  range: Range;
}
