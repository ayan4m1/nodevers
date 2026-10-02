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

  [key: string]: string | boolean | number;
};

export type SupportMatrixItem = {
  node: string;
  date: Date;
  lts: boolean;
};

export type RawSupportMatrixData = Record<number, SupportMatrixItem[]>;
export type SupportMatrixData = [number, SupportMatrixItem[]][];

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

  [key: string]:
    | string
    | string[]
    | { url: string; name: string; email: string }
    | undefined;
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

  [key: string]: string | PackageData[];
};

export type DataResult<T> = {
  data?: T;
  loading: boolean;
  error?: Error;
};
