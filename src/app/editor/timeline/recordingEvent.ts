import { Classification } from '../../models/classification';
import { Range } from '../../models/range';
import { RecordingEventType } from './recordingEventType';

export class RecordingEvent {
  eventType: RecordingEventType;
  clazz?: Classification;
  range?: Range;
}
