import { compare, major, prerelease, satisfies } from 'semver';
import { parseISO } from 'date-fns';
import { useEffect, useState, useMemo } from 'react';

import {
  FilterOptions,
  NodeVersionData,
  RawNodeVersionData,
  SortOptions
} from '../types';
import { isNodeVersionSupported } from '../utils';

const semverFields = ['node', 'npm'];
const url = 'https://nodejs.org/dist/index.json';

interface IProps {
  sort: SortOptions;
  filter?: FilterOptions;
}

export default function useNodeVersionData({ sort, filter }: IProps) {
  const { field, direction } = sort;
  const [data, setData] = useState<NodeVersionData[]>([]);
  const [error, setError] = useState<Error>();
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
        const rawData =
          (await result.json()) as unknown as RawNodeVersionData[];

        const firstReleases = new Map<number, Date>();

        for (const { version, date } of rawData) {
          if (prerelease(version)) {
            continue;
          }

          const majorVersion = major(version);
          const releaseDate = parseISO(date);
          const existing = firstReleases.get(majorVersion);

          if (!existing || releaseDate < existing) {
            firstReleases.set(majorVersion, releaseDate);
          }
        }

        const now = new Date();

        const transformedData: NodeVersionData[] = rawData.map(
          ({ version, lts, npm, modules, date }) => {
            const majorVersion = major(version);

            return {
              node: version.replace(/^v/, ''),
              npm: npm ?? '0.0.0',
              supported: isNodeVersionSupported(
                majorVersion,
                firstReleases.get(majorVersion) ?? parseISO(date),
                now
              ),
              lts,
              modules: isNaN(parseInt(modules, 10)) ? 0 : parseInt(modules, 10),
              date
            };
          }
        );

        if (field) {
          transformedData.sort((a, b) => {
            const [aVal, bVal] = [a[field], b[field]];

            if (!aVal) {
              return direction ? -1 : 1;
            }

            if (semverFields.includes(field)) {
              return (
                compare(aVal as string, bVal as string) * (direction ? -1 : 1)
              );
            } else if (typeof aVal === 'string') {
              return aVal.localeCompare(bVal as string) * (direction ? -1 : 1);
            } else if (typeof bVal === 'number' && typeof aVal === 'number') {
              return direction ? bVal - aVal : aVal - bVal;
            } else {
              return 0;
            }
          });
        }

        setData(transformedData);
      } catch (err) {
        setError(err as Error);
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
