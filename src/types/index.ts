export type SortOptions = {
  field: string;
  direction: boolean;
};

export type FilterOptions = {
  desiredAppName: string;
  term: string;
};

export type NodeVersionData = {
  node: string;
  npm: string;
  lts: boolean;
  modules: string;
  date: string;
};

export type PackageData = {
  name: string;
  version: string;
  keywords?: string[];
  author?: {
    url: string;
    name: string;
    email: string;
  };
  homepage?: string;
  main?: string;
  engines?: string[];
  description?: string;
};

export type PackageVersionData = {
  name: string;
  version: string;
  versions: PackageData[];
  latestVersion: string;
  changelogUrl: string;
};

export type DataResult<T> = {
  data?: T;
  loading: boolean;
  error?: Error;
};
