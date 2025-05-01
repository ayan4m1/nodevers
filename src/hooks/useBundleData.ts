import debounce from 'lodash.debounce';
import { useCallback, useState } from 'react';

import { BundleData, DataResult } from '../types';

interface IProps {
  name: string;
  backwardsLimit: number;
}

type FetchDataFunc = (props: IProps) => Promise<void>;

export default function useBundleData(): DataResult<BundleData> & {
  fetchData: FetchDataFunc;
} {
  const [data, setData] = useState<BundleData>(null);
  const [error, setError] = useState<Error>(null);
  const [loading, setLoading] = useState(true);
  const fetchData = debounce(async ({ name, backwardsLimit }: IProps) => {
    try {
      const result = await fetch(
        `https://bundlephobia.com/api/package-history?package=${name}&limit=${backwardsLimit}`
      );
      const data = await result.json();

      setData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, 1000);

  return {
    data,
    fetchData,
    error,
    loading
  };
}
