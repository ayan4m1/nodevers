import { rsort, satisfies } from 'semver';
import { useEffect, useState } from 'react';

import {
  getChangelogUrl,
  getLatestVersion,
  getPackageManifestUrl
} from '../utils';
import { DataResult, PackageVersionData } from '../types';

interface IProps {
  name: string;
  version: string;
}

export default function usePackageVersionData({
  name,
  version
}: IProps): DataResult<PackageVersionData> {
  const [data, setData] = useState<PackageVersionData>(null);
  const [error, setError] = useState<Error>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetch(getPackageManifestUrl(name));
        const manifest = await result.json();
        const latestVersion = getLatestVersion(manifest);
        const changelogUrl = await getChangelogUrl(manifest);

        const newData: PackageVersionData = {
          ...manifest,
          latestVersion,
          changelogUrl
        };

        if (!version) {
          setData({
            ...newData,
            versions: rsort(
              Object.entries(newData.versions).map(([, val]) => val.version)
            ).map((versionStr) => newData.versions[versionStr])
          });
        } else {
          setData({
            ...newData,
            versions: await Promise.all(
              rsort(
                Object.entries(newData.versions)
                  .filter(([testVersion]) => satisfies(testVersion, version))
                  .map(([, val]) => val.version)
              ).map(async (versionStr) => ({
                ...newData.versions[versionStr],
                changelogUrl: await getChangelogUrl(newData, versionStr)
              }))
            )
          });
        }
      } catch (err) {
        setError(err);
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
