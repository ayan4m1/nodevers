import { sort } from 'semver';
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

const changelogRegex = /^\.\/changelog.*$/i;
const packageContentsUrl = 'https://www.npmjs.com/package/';
const packageDataUrl = 'https://registry.npmjs.org/';
const bundleDataUrl = 'https://bundlephobia.com/api/package-history';

export const getPageTitle = (title: string): string => `Nodevers - ${title}`;

export const getBundleDataUrl = (packageName: string) =>
  `${bundleDataUrl}?package=${encodeURIComponent(packageName)}`;

export const getPackageManifestUrl = (packageName: string) =>
  `${packageDataUrl}${encodeURIComponent(packageName)}`;

export const getPackageContentsUrl = (packageName: string, version: string) =>
  `${packageContentsUrl}${packageName}/v/${version}/index`;

export const getCodeBrowserUrl = (packageName: string) =>
  `https://www.npmjs.com/package/${packageName}?activeTab=code`;

export const getLatestVersion = ({ 'dist-tags': tags, versions }) =>
  tags.latest ?? sort(versions)[0];

export const getChangelogUrl = async (
  manifest: PackageManifest,
  desiredVersion = 'latest'
) => {
  const { name, homepage } = manifest;

  if (!homepage) {
    return null;
  }

  const targetVersion =
    desiredVersion === 'latest' ? getLatestVersion(manifest) : desiredVersion;

  try {
    const filesResult = await fetch(
      getPackageContentsUrl(name, targetVersion),
      {
        mode: 'no-cors'
      }
    );
    const { files } = await filesResult.json();

    const changelogFilePath = Object.keys(files).find((path) =>
      changelogRegex.test(path)
    );

    // this will never work... ugh

    try {
      const homepageUrl = new URL(homepage);

      homepageUrl.hash = undefined;
      homepageUrl.pathname += `/${changelogFilePath.replace(/^\.\//, '')}`;

      return homepageUrl.toString();
    } catch {
      return null;
    }
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
