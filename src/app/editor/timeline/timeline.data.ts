import * as vis from 'vis';
import { DataItem, DataSet, IdType } from 'vis';
import { LabelGroup } from './label.group';

export class TimelineData {
  private readonly _groups: vis.DataSet<LabelGroup>;
  private readonly _items: vis.DataSet<DataItem>;
  private readonly map;

  constructor() {
    this._groups = new vis.DataSet<LabelGroup>();
    this._items = new vis.DataSet<DataItem>();
  }

  get groups(): DataSet<LabelGroup> {
    return this._groups;
  }

  getGroupIds(): IdType[] {
    return this._groups.getIds();
  }

  get items(): DataSet<DataItem> {
    return this._items;
  }

  clear() {
    this.groups.clear();
    this.items.clear();
  }

  addGroup(group: LabelGroup) {
    this._groups.add(group);
  }

  addGroups(groups: LabelGroup[]) {
    this._groups.add(groups);
  }

  addItem(item: DataItem) {
    this._items.add(item);
  }

  removeGroup(id: string) {
    this._groups.remove(id);
  }

  updateGroup(group: LabelGroup) {
    this._groups.update(group);
  }
}
