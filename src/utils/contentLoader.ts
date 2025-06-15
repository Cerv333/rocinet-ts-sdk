import {DatasetTypeEnum} from "../enums/DatasetTypeEnum";

export type ContentLoader = (raw: string | null) => any;
export type ContentLoaderMap = Record<string, ContentLoader>;

export function noneLoader(inputValue: string | null): string | null {
  return null;
}

export function scalarLoader(inputValue: string | null): string | null {
  return inputValue;
}

export function jsonLoader(inputValue: string | null): any {
  if (inputValue === null) {
    return null;
  } else {
    return JSON.parse(inputValue);
  }
}

export const contentLoaders: ContentLoaderMap = {
  [DatasetTypeEnum.NONE]: noneLoader,
  [DatasetTypeEnum.SCALAR]: scalarLoader,
  [DatasetTypeEnum.JSON]: jsonLoader
}
