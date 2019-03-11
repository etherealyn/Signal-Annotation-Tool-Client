import * as vis from 'vis';
import { DataGroup, DataItem, DataSet, IdType } from 'vis';
import * as hyperid from 'hyperid';

export class TimelineData {
  private readonly _groups: vis.DataSet<DataGroup>;
  private readonly _items: vis.DataSet<DataItem>;
  private readonly _map: Map<IdType, { id: IdType, recording: boolean }>;

  private instance = hyperid();

  constructor() {
    this._groups = new vis.DataSet<DataGroup>();
    this._items = new vis.DataSet<DataItem>();
    this._map = new Map<IdType, { id: IdType, recording: boolean }>();
  }

  getGroupIds(): IdType[] {
    return this._groups.getIds();
  }

  clear() {
    this._groups.clear();
    this._items.clear();
  }

  addGroup(group: DataGroup) {
    this._groups.add(group);
    this._map.set(group.id, {id: undefined, recording: false});
  }

  addGroups(groups: DataGroup[]) {
    this._groups.add(groups);
    groups.forEach(x => {
      this._map.set(x.id, {id: undefined, recording: false});
    });
  }

  addItem(item: DataItem) {
    this._items.add(item);
  }

  removeGroup(id: string) {
    this._groups.remove(id);
    this._map.delete(id);
  }

  updateGroup(group: DataGroup) {
    this._groups.update(group);
  }

  getGroup(id: IdType) {
    return this._groups.get(id);
  }

  get groups() {
    return this._groups;
  }

  get items() {
    return this._items;
  }

  get map() {
    return this._map;
  }

  get diagostic() {
    return JSON.stringify(this._map);
  }

  startRecording(groupId: IdType, start: number) {
    const item = {id: this.instance(), group: groupId, content: '', start};
    this.items.add(item);
    this._map.set(groupId, {id: item.id, recording: true});
  }

  isRecording(id: IdType) {
    return this._map.get(id);
  }

  updateRecordings(millis: number) {
    this._groups.forEach((group, id) => {
      const status = this._map.get(id);
      if (status && status.recording) {
        const item = this._items.get(status.id);
        item.end = millis;
        this._items.update(item);
      }
    });
  }

  stopRecording(id: IdType) {
    if (this._map.has(id)) {
      this._map.delete(id);
    }
  }
}
