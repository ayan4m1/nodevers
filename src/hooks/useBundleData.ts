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
  const [data, setData] = useState<BundleData[]>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);
  const fetchData = useMemo(
    () =>
      debounce(async ({ name }: IProps) => {
        setError(undefined);

        try {
          const result = await fetch(getBundleDataUrl(name));

          // bundlephobia rate limits aggressively; treat failures as "no data"
          if (!result.ok) {
            setData([]);
            return;
          }

          const rawData = (await result.json()) as RawBundleData;

          const transformedData: BundleData[] = rawData.versions.flatMap(
            ({ version, size, gzip, built }) =>
              built && size !== null && gzip !== null
                ? [
                    {
                      gzippedSize: gzip,
                      name: rawData.name,
                      repoUrl: rawData.repository,
                      size,
                      version
                    }
                  ]
                : []
          );

          setData(transformedData);
        } catch (err) {
          setError(err as Error);
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
