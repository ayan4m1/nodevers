import { rsort, satisfies } from 'semver';
import { useEffect, useState } from 'react';

import {
  getChangelogUrl,
  getLatestVersion,
  getPackageManifestUrl
} from '../utils';
import { DataResult, PackageManifest, PackageVersionData } from '../types';

interface IProps {
  name: string;
  version: string;
}

export default function usePackageVersionData({
  name,
  version
}: IProps): DataResult<PackageVersionData> {
  const [data, setData] = useState<PackageVersionData>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetch(getPackageManifestUrl(name));
        const manifest: PackageManifest = await result.json();
        const latestVersion = getLatestVersion(manifest);
        const changelogUrl = await getChangelogUrl(manifest);

        const sortedVersions = (range?: string) =>
          rsort(
            Object.keys(manifest.versions).filter(
              (testVersion) => !range || satisfies(testVersion, range)
            )
          );

        const newData = {
          ...manifest,
          latestVersion,
          changelogUrl
        };

        if (!version) {
          setData({
            ...newData,
            versions: sortedVersions().map(
              (versionStr) => manifest.versions[versionStr]
            )
          });
        } else {
          setData({
            ...newData,
            versions: await Promise.all(
              sortedVersions(version).map(async (versionStr) => ({
                ...manifest.versions[versionStr],
                changelogUrl:
                  (await getChangelogUrl(manifest, versionStr)) ?? undefined
              }))
            )
          });
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [name, version]);

  return {
    data,
    error,
    loading
  };
}
