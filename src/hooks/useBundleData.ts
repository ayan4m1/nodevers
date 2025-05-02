import { useMemo, useState } from 'react';
import { DebouncedFunc, debounce } from 'lodash';

import { BundleData, DataResult, RawBundleData } from '../types';
import { getBundleDataUrl } from '../utils';

interface IProps {
  name: string;
}

export default function useBundleData(): DataResult<BundleData[]> & {
  fetchData: DebouncedFunc<(props: IProps) => void>;
} {
  const [data, setData] = useState<BundleData[]>(null);
  const [error, setError] = useState<Error>(null);
  const [loading, setLoading] = useState(true);
  const fetchData = useMemo(
    () =>
      debounce(async ({ name }: IProps) => {
        try {
          const result = await fetch(getBundleDataUrl(name));
          const rawData = (await result.json()) as unknown as RawBundleData;

          const transformedData: BundleData[] = Object.entries(rawData).map(
            ([
              version,
              { name, dependencyCount, gzip, size, isModuleType, repository }
            ]) => ({
              dependencies: dependencyCount,
              gzippedSize: gzip,
              name: name,
              repoUrl: repository,
              size,
              supportsEsModules: isModuleType,
              version
            })
          );

          setData(transformedData);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      }, 1000),
    []
  );

  return {
    data,
    fetchData,
    error,
    loading
  };
}
