import { Helmet } from 'react-helmet';
import { Badge, Table } from 'react-bootstrap';
import { Fragment, useCallback, useState } from 'react';
import { faFileText } from '@fortawesome/free-solid-svg-icons';

import LinkButton from 'components/LinkButton';
import FilterForm from 'components/nodeVersions/FilterForm';
import CustomErrorBoundary from 'components/ErrorBoundary';
import useNodeVersionData from 'hooks/useNodeVersionData';

export const ErrorBoundary = CustomErrorBoundary;

export function Component() {
  const [filter, setFilter] = useState(null);
  const [sort, setSort] = useState({
    field: 'date',
    direction: false
  });
  const { data, error, loading } = useNodeVersionData({ sort, filter });

  const handleSortClick = useCallback((newField) => {
    setSort(({ field, direction }) => {
      if (field === newField) {
        return {
          field,
          direction: !direction
        };
      } else {
        return { field: newField, direction };
      }
    });
  }, []);

  if (loading) {
    return (
      <Fragment>
        <h1>Loading...</h1>
      </Fragment>
    );
  } else if (error) {
    throw error;
  }

  return (
    <Fragment>
      <Helmet title="Node/NPM Release Versions" />
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
          {data.length ? (
            data.map(({ node, npm, lts, modules, date }) => (
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
                    className="ms-2"
                    href={`https://nodejs.org/en/blog/release/v${node}`}
                    icon={faFileText}
                  />
                </td>
                <td className="text-end">
                  <span>{npm}</span>
                  <LinkButton
                    className="ms-2"
                    href={`https://github.com/npm/cli/releases/tag/v${npm}`}
                    icon={faFileText}
                  />
                </td>
                <td className="text-end">{modules}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center" colSpan={5}>
                No matching releases.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Fragment>
  );
}
