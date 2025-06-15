import {BaseObject} from "./BaseObject";
import {ContentLoader} from "../utils/contentLoader";

export class DataItem<T> extends BaseObject {
  constructor(id: number, active: boolean, valid: boolean, createTime: Date, public key: string, public syncId: number | null,
              public searchValue: string | null, public hash: string, public content: T, public sourceUpdateTime: Date | null,
              public contentUpdateTime: Date, public datasetId: number, public executionId: number | null, public dependOnId: number | null) {
    super(id, active, valid, createTime);
  }

  static from<T>(data: any, contentLoader?: ContentLoader): DataItem<T> {
    const base = BaseObject.from(data);
    return new DataItem(base.id, base.active, base.valid, base.createTime, data.key, data.syncId ?? null, data.searchValue ?? null, data.hash,
      contentLoader ? contentLoader(data.content) : data.content, data.sourceUpdateTime ? new Date(data.sourceUpdateTime) : null,
      new Date(data.contentUpdateTime), data.dataset, data.execution ?? null, data.dependOn ?? null);
  }
}
