import { compare } from 'semver';
import { useEffect, useState } from 'react';

const semverFields = ['node', 'npm'];
const url = 'https://nodejs.org/dist/index.json';

export default function useNodeVersionData(sortField, sortDirection) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

        if (sortField) {
          transformedData.sort((a, b) => {
            const [aVal, bVal] = [a[sortField], b[sortField]];

            if (!aVal) {
              return sortDirection ? -1 : 1;
            }

            if (semverFields.includes(sortField)) {
              return compare(aVal, bVal) * sortDirection ? -1 : 1;
            } else if (typeof aVal === 'string') {
              return aVal.localeCompare(bVal) * sortDirection ? -1 : 1;
            } else {
              return sortDirection ? bVal - aVal : aVal - bVal;
            }
          });
        }

        setData(transformedData);
      } catch (err) {
        // eslint-disable-next-line
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [sortField, sortDirection]);

  return {
    data,
    error,
    loading
  };
}
