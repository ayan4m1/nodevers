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

export type BundleData = {
  name: string;
  version: string;
  gzippedSize: number;
  size: number;
  dependencies: number;
  supportsEsModules: boolean;
  repoUrl?: string;
};

export type PackageManifest = {
  name: string;
  version: string;
  homepage?: string;
  'dist-tags': {
    latest: string;
  };
  versions: {
    test: number;
  }[];
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
