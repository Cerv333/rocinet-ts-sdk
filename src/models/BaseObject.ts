export class BaseObject {
  constructor(public id: number, public active: boolean, public valid: boolean, public createTime: Date) {}

  static from(data: any): BaseObject {
    return new BaseObject(data.id, data.active, data.valid, new Date(data.createTime));
  }
}
