import {Dataset} from "./models/Dataset";
import {DataItem} from "./models/DataItem";
import {DatasetType} from "./models/DatasetType";
import {ContentLoader, contentLoaders} from "./utils/contentLoader";


export class Rocinet {
  private datasetTypesByStr: Record<string, DatasetType> | undefined = undefined;
  private datasetTypesById: Record<number, DatasetType> | undefined = undefined;
  private datasetsByStr: Record<string, Dataset> = {};
  private datasetsById: Record<number, Dataset> = {};

  constructor(private accessToken: string, private listSize: number = 1000) {
  }

  private get headers(): HeadersInit {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      Accept: "application/json"
    };
  }

  public async* getDataItems<T>(dataset: string | number | Dataset, contentUpdateAfter?: Date, contentUpdateBefore?: Date): AsyncGenerator<DataItem<T>> {
    const datasetObj = dataset instanceof Dataset ? dataset : await this.getDataset(dataset);
    const loader = await this.getContentLoader(datasetObj);

    const filterParts: string[] = [];
    if (contentUpdateAfter) {
      filterParts.push(`&contentUpdateTime[%3E%3D]=${encodeURIComponent(contentUpdateAfter.toISOString())}`);
    }
    if (contentUpdateBefore) {
      filterParts.push(`&contentUpdateTime[<]=${encodeURIComponent(contentUpdateBefore.toISOString())}`);
    }

    const filterPartsStr = filterParts.join("");

    let offset = 0;
    let stop = false;
    while (!stop) {
      const url = `https://api.rocinet.com/datasets/${datasetObj.id}/data_items?limit=${this.listSize}&offset=${offset}&sort=createTime%2B${filterPartsStr}`;
      const res = await fetch(url, {headers: this.headers});
      if (!res.ok) {
        throw new Error(`Failed to fetch data_items: ${res.status}`);
      }
      const json = await res.json();
      const items = json.items || [];
      for (const item of items) {
        yield DataItem.from<T>(item, loader);
      }
      offset += this.listSize;
      stop = items.length < this.listSize;
    }
  }

  public async getDatasetType(unique: string | number): Promise<DatasetType> {
    if (this.datasetTypesByStr === undefined) {
      await this.loadDatasetTypes();
    }
    return typeof unique === "string" ? this.datasetTypesByStr![unique] : this.datasetTypesById![unique];
  }

  public async getDataset(unique: string | number, forceReload = false): Promise<Dataset> {
    let dataset = typeof unique === "string" ? this.datasetsByStr[unique] : this.datasetsById[unique];
    if (!dataset || forceReload) {
      dataset = await this.loadDataset(unique);
    }
    return dataset;
  }

  private async loadDataset(unique: string | number): Promise<Dataset> {
    const url = `https://api.rocinet.com/datasets/${unique}`;
    const res = await fetch(url, {headers: this.headers});
    if (!res.ok) {
      throw new Error(`Failed to fetch dataset: ${res.status}`);
    }
    const data = await res.json();
    const dataset = Dataset.from(data);
    this.datasetsByStr[dataset.strCode] = dataset;
    this.datasetsById[dataset.id] = dataset;
    return dataset;
  }

  private async loadDatasetTypes(): Promise<void> {
    const url = `https://api.rocinet.com/dataset_types?limit=9999`;
    const res = await fetch(url, {headers: this.headers});
    if (!res.ok) throw new Error(`Failed to fetch dataset types: ${res.status}`);
    const json = await res.json();
    this.datasetTypesByStr = {};
    this.datasetTypesById = {};
    for (const item of json.items || []) {
      const datasetType = DatasetType.from(item);
      this.datasetTypesByStr[datasetType.strCode] = datasetType;
      this.datasetTypesById[datasetType.id] = datasetType;
    }
  }

  private async getContentLoader(dataset: Dataset): Promise<ContentLoader> {
    const datasetType = await this.getDatasetType(dataset.datasetTypeId);
    const loader = contentLoaders[datasetType.strCode];
    if (!loader){
      throw new Error(`Unsupported dataset type: ${datasetType.strCode}`);
    }
    return loader;
  }
}