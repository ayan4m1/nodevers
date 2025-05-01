import { useCallback, useState } from 'react';
import { BundleData, DataResult } from '../types';

interface IProps {
  name: string;
  version: string;
  backwardsLimit: number;
}

type FetchDataFunc = (props: IProps) => Promise<void>;

export default function useBundleData(): DataResult<BundleData> & {
  fetchData: FetchDataFunc;
} {
  const [data, setData] = useState<BundleData>(null);
  const [error, setError] = useState<Error>(null);
  const [loading, setLoading] = useState(true);
  const fetchData = useCallback(
    async ({ name, version, backwardsLimit }: IProps) => {
      try {
        const result = await fetch(
          `https://bundlephobia.com/api/package-history?package=${name}@${version}&limit=${backwardsLimit}`
        );
        const data = await result.json();

        console.dir(data);
        setData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    data,
    fetchData,
    error,
    loading
  };
}
