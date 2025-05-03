import { Badge, Card, Table } from 'react-bootstrap';
import { Fragment, useCallback, useState } from 'react';
import { faFileText } from '@fortawesome/free-solid-svg-icons';

import LinkButton from '../components/LinkButton';
import FilterForm from '../components/nodeVersions/FilterForm';
import SuspenseFallback from '../components/SuspenseFallback';
import useNodeVersionData from '../hooks/useNodeVersionData';
import { getPageTitle } from '../utils';

export function Component() {
  const [filter, setFilter] = useState(null);
  const [sort, setSort] = useState({
    field: 'date',
    direction: true
  });
  const { data, error, loading } = useNodeVersionData({ sort, filter });

  const handleSortClick = useCallback((newField: string) => {
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
    return <SuspenseFallback />;
  } else if (error) {
    throw error;
  }

  return (
    <Fragment>
      <title>{getPageTitle('Node/NPM Release Versions')}</title>
      <FilterForm onFilterChange={setFilter} />
      <Card body>
        <Card.Title className="mb-4 text-light">Matching Versions</Card.Title>
        <Table hover variant="dark" className="mb-2">
          <thead>
            <tr>
              <th onClick={() => handleSortClick('date')}>Release Date</th>
              <th
                className="text-center"
                onClick={() => handleSortClick('lts')}
              >
                LTS
              </th>
              <th className="text-end" onClick={() => handleSortClick('node')}>
                Node.js Version
              </th>
              <th className="text-end" onClick={() => handleSortClick('npm')}>
                NPM Version
              </th>
              <th
                className="text-end"
                onClick={() => handleSortClick('modules')}
              >
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
                      size="sm"
                    />
                  </td>
                  <td className="text-end">
                    {Boolean(npm) && (
                      <Fragment>
                        <span>{npm}</span>
                        <LinkButton
                          className="ms-2"
                          href={`https://github.com/npm/cli/releases/tag/v${npm}`}
                          icon={faFileText}
                          size="sm"
                        />
                      </Fragment>
                    )}
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
          <tfoot>
            <tr>
              <td colSpan={5} className="text-end">
                Package metadata graciously provided by{' '}
                <a
                  href="https://npmjs.com"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  NPM
                </a>
                .
              </td>
            </tr>
          </tfoot>
        </Table>
      </Card>
    </Fragment>
  );
}
