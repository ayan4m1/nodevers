// const { get } = require('https');

import { useEffect, useState } from 'react';

// const ENDPOINT = 'https://nodejs.org/dist/index.json';

// function requestVersionInfo(url) {
//   return new Promise((resolve, reject) => {
//     get(url, response => {
//       let data = '';
//       response.on('data', chunk => data += chunk);
//       response.on('end', () => resolve(data));
//     }).on('error', error => reject(new Error(error)));
//   });
// }

// function extractVersionInfo(json) {
//   return JSON.parse(json).map(({ version, npm = null }) => {
//     return {
//       nodejs: version.replace(/^v/, ''),
//       npm
//     };
//   });
// }

// (async function logVersionInfo() {
//   try {
//     const json = await requestVersionInfo(ENDPOINT);
//     const versionInfo = extractVersionInfo(json);
//     console.log(JSON.stringify(versionInfo, null, 2));

//   } catch ({ message }) {
//     console.error(message);
//   }
// })();

const url = 'https://nodejs.org/dist/index.json';

export default function useNodeVersionData(sortField, sortDirection) {
  const [data, setData] = useState(null);
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

            return aVal.localeCompare(bVal) * sortDirection ? -1 : 1;
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
