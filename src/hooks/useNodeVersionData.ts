import { compare, satisfies } from 'semver';
import { useEffect, useState, useMemo } from 'react';

import { FilterOptions, NodeVersionData, SortOptions } from '../types';

const semverFields = ['node', 'npm'];
const url = 'https://nodejs.org/dist/index.json';

interface IProps {
  sort: SortOptions;
  filter: FilterOptions;
}

export default function useNodeVersionData({ sort, filter }: IProps) {
  const { field, direction } = sort;
  const [data, setData] = useState<NodeVersionData[]>([]);
  const [error, setError] = useState<Error>(null);
  const [loading, setLoading] = useState(true);
  const filteredData = useMemo(() => {
    if (!filter) {
      return data;
    }

    const { desiredAppName, term } = filter;

    return data?.filter(({ node, npm }) => {
      const targetAppVersion = desiredAppName === 'node' ? npm : node;

      return satisfies(targetAppVersion, term);
    });
  }, [data, filter]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetch(url);
        const rawData = await result.json();

        const transformedData = rawData.map(
          ({ version, lts, npm, modules, date }) => ({
            node: version.replace(/^v/, ''),
            npm,
            lts,
            modules,
            date
          })
        );

        if (field) {
          transformedData.sort((a, b) => {
            const [aVal, bVal] = [a[field], b[field]];

            if (!aVal) {
              return direction ? -1 : 1;
            }

            if (semverFields.includes(field)) {
              return compare(aVal, bVal) * (direction ? -1 : 1);
            } else if (typeof aVal === 'string') {
              return aVal.localeCompare(bVal) * (direction ? -1 : 1);
            } else {
              return direction ? bVal - aVal : aVal - bVal;
            }
          });
        }

        setData(transformedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [field, direction, filter]);

  return {
    data: filteredData,
    error,
    loading
  };
}
