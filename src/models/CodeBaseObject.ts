import {BaseObject} from "./BaseObject";

export class CodeBaseObject extends BaseObject {
  constructor(id: number, active: boolean, valid: boolean, createTime: Date, public title: string, public strCode: string) {
    super(id, active, valid, createTime);
  }

  static from(data: any): CodeBaseObject {
    const base = BaseObject.from(data);
    return new CodeBaseObject(base.id, base.active, base.valid, base.createTime, data.title, data.strCode);
  }
}