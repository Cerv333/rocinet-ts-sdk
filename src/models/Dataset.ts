import {CodeBaseObject} from "./CodeBaseObject";

export class Dataset extends CodeBaseObject {
  constructor(id: number, active: boolean, valid: boolean, createTime: Date, title: string, strCode: string,
              public itemAutoDeleteInterval: number | null, public itemAutoDeleteCascade: boolean, public isPublic: boolean,
              public workspaceId: number, public dataCollectionId: number | null, public datasetTypeId: number
  ) {
    super(id, active, valid, createTime, title, strCode);
  }

  static from(data: any): Dataset {
    const base = CodeBaseObject.from(data);
    return new Dataset(base.id, base.active, base.valid, base.createTime, base.title, base.strCode, data.itemAutoDeleteInterval ?? null,
      data.itemAutoDeleteCascade, data.public, data.workspace, data.dataCollection ?? null, data.datasetType
    );
  }
}