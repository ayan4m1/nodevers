export type SortOptions = {
  field: string;
  direction: boolean;
};

export type FilterOptions = {
  desiredAppName: string;
  term: string;
};

export type RawNodeVersionData = {
  version: string;
  npm: string;
  lts: boolean;
  modules: string;
  date: string;
};

export type NodeVersionData = {
  node: string;
  npm: string;
  lts: boolean;
  modules: number;
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

export type RawBundleData = Record<
  string,
  {
    dependencyCount: number;
    gzip: number;
    isModuleType: boolean;
    name: string;
    repository?: string;
    size: number;
  }
>;

export type BundleData = {
  dependencies: number;
  gzippedSize: number;
  name: string;
  repoUrl?: string;
  size: number;
  supportsEsModules: boolean;
  version: string;
};

export type NodeFormContext = {
  desiredAppName: string;
  term: string;
};

export type PackageFormContext = {
  name: string;
  version: string;
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
