import { satisfies } from 'semver';
import { useCallback, useState, useMemo } from 'react';
import { Badge, Table } from 'react-bootstrap';
import { faFileText } from '@fortawesome/free-solid-svg-icons';

import Layout from 'components/Layout';
import FilterForm from 'components/FilterForm';
import LinkButton from 'components/LinkButton';
import useNodeVersionData from 'hooks/useNodeVersionData';

export default function App() {
  const [filter, setFilter] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(true);
  const { data, error, loading } = useNodeVersionData(sortField, sortDirection);

  const filteredData = useMemo(
    () =>
      !filter
        ? data
        : data?.filter(({ node, npm }) => {
            const { desiredAppName, term } = filter;
            const targetAppVersion = desiredAppName === 'node' ? npm : node;

            return satisfies(targetAppVersion, term);
          }),
    [data, filter]
  );

  const handleSortClick = useCallback((field) => {
    setSortField((prevSortField) => {
      if (prevSortField === field) {
        setSortDirection((prevVal) => !prevVal);
        return prevSortField;
      } else {
        return field;
      }
    });
  }, []);

  if (loading) {
    return (
      <Layout>
        <h1>Loading...</h1>
      </Layout>
    );
  } else if (error) {
    return (
      <Layout>
        <h1>Runtime Error!</h1>
        <blockquote>{JSON.stringify(error, null, 2)}</blockquote>
      </Layout>
    );
  }

  return (
    <Layout>
      <FilterForm onFilterChange={setFilter} />
      <Table variant="dark">
        <thead>
          <tr>
            <th onClick={() => handleSortClick('date')}>Release Date</th>
            <th className="text-center" onClick={() => handleSortClick('lts')}>
              LTS
            </th>
            <th className="text-end" onClick={() => handleSortClick('node')}>
              Node.js Version
            </th>
            <th className="text-end" onClick={() => handleSortClick('npm')}>
              NPM Version
            </th>
            <th className="text-end" onClick={() => handleSortClick('modules')}>
              Module Version
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length ? (
            filteredData.map(({ node, npm, lts, modules, date }) => (
              <tr key={node}>
                <td>{date}</td>
                <td className="text-center">
                  <Badge bg={lts ? 'success' : 'warning'}>
                    {lts ? 'LTS' : 'Non-LTS'}
                  </Badge>
                </td>
                <td className="text-end">
                  <span>{node}</span>
                  <LinkButton
                    href={`https://nodejs.org/en/blog/release/v${node}`}
                    icon={faFileText}
                    className="ms-2"
                  />
                </td>
                <td className="text-end">
                  <span>{npm}</span>
                  <LinkButton
                    href={`https://github.com/npm/cli/releases/tag/v${npm}`}
                    icon={faFileText}
                    className="ms-2"
                  />
                </td>
                <td className="text-end">{modules}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                No matching releases.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Layout>
  );
}
