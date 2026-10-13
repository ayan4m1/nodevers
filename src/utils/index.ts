import { rsort } from 'semver';
import { addMonths, isBefore } from 'date-fns';

import { PackageManifest } from '../types';

// const getGitLabUrl = ([user, repo]) => `https://gitlab.com/${user}/${repo}`;
// const getBitbucketUrl = ([user, repo]) =>
//   `https://bitbucket.org/${user}/${repo}`;
// const getGitHubUrl = ([user, repo]) => `https://github.com/${user}/${repo}`;
// const getGistUrl = (id) => `https://gist.github.com/${id}`;
// const getUserAndRepo = (locator) => locator.split('/');

// export const repositoryResolvers = {
//   github: (locator) => getGitHubUrl(getUserAndRepo(locator)),
//   gist: (id) => getGistUrl(id),
//   bitbucket: (locator) => getBitbucketUrl(getUserAndRepo(locator)),
//   gitlab: (locator) => getGitLabUrl(getUserAndRepo(locator))
// };

export enum PackageManager {
  NPM = 'npm',
  Yarn = 'yarn',
  PNPM = 'pnpm'
}

const changelogRegex = /^\/(changelog|history|changes)(\.\w+)?$/i;
const packageFilesUrl = 'https://data.jsdelivr.com/v1/packages/npm/';
const packageCdnUrl = 'https://cdn.jsdelivr.net/npm/';
const packageDataUrl = 'https://registry.npmjs.org/';
const bundleDataUrl = 'https://bundlephobia.com/api/package-history';

const currentPhaseMonths = 6;
const ltsEndMonths = 36;
const annualReleaseMajor = 27;

export const isNodeVersionSupported = (
  majorVersion: number,
  releaseDate: Date,
  now: Date = new Date()
): boolean => {
  if (isBefore(now, addMonths(releaseDate, currentPhaseMonths))) {
    return true;
  }

  const becomesLts =
    majorVersion >= annualReleaseMajor || majorVersion % 2 === 0;

  return becomesLts && isBefore(now, addMonths(releaseDate, ltsEndMonths));
};

export const getPageTitle = (title: string): string => `Nodevers - ${title}`;

export const getBundleDataUrl = (packageName: string) =>
  `${bundleDataUrl}?package=${encodeURIComponent(packageName)}`;

export const getPackageManifestUrl = (packageName: string) =>
  `${packageDataUrl}${encodeURIComponent(packageName)}`;

export const getPackageFilesUrl = (packageName: string, version: string) =>
  `${packageFilesUrl}${packageName}@${version}?structure=flat`;

export const getPackageFileUrl = (
  packageName: string,
  version: string,
  path: string
) => `${packageCdnUrl}${packageName}@${version}/${path}`;

export const getCodeBrowserUrl = (packageName: string) =>
  `https://www.npmjs.com/package/${packageName}?activeTab=code`;

export const getLatestVersion = ({
  'dist-tags': tags,
  versions
}: PackageManifest) => tags.latest ?? rsort(Object.keys(versions))[0];

export const getChangelogUrl = async (
  manifest: PackageManifest,
  desiredVersion = 'latest'
) => {
  const { name } = manifest;
  const targetVersion =
    desiredVersion === 'latest' ? getLatestVersion(manifest) : desiredVersion;

  try {
    const filesResult = await fetch(getPackageFilesUrl(name, targetVersion));

    if (!filesResult.ok) {
      return null;
    }

    const { files }: { files: { name: string }[] } = await filesResult.json();
    const changelogFile = files.find((file) => changelogRegex.test(file.name));

    if (!changelogFile) {
      return null;
    }

    return getPackageFileUrl(name, targetVersion, changelogFile.name.slice(1));
  } catch {
    return null;
  }
};

export const qualifiers = [
  { prefix: 'author', type: 'string' },
  { prefix: 'maintainer', type: 'string' },
  { prefix: 'keywords', type: 'string' },
  { prefix: 'not', type: 'string' },
  { prefix: 'is', type: 'string' },
  { prefix: 'boost-exact', type: 'boolean' }
];

export const booleanQualifiers = ['unstable', 'insecure'];

export class Qualifier {
  prefix: string;
  type: string;
  value: string;

  constructor(prefix = '', value = '', type = 'string') {
    this.prefix = prefix;
    this.value = value;
    this.type = type;
    this.toString = this.toString.bind(this);
  }

  toString() {
    return `${this.prefix}:${this.value}`;
  }
}
