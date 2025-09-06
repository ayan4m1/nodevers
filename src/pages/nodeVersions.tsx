import { List } from 'react-window';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import { Fragment, useCallback, useState } from 'react';

import SortIcon from '../components/SortIcon';
import ResultRow from '../components/nodeVersions/ResultRow';
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

  console.dir(filter);

  return (
    <Fragment>
      <title>{getPageTitle('Node/NPM Release Versions')}</title>
      <FilterForm onFilterChange={setFilter} />
      <Card body>
        <Card.Title className="mb-4 text-light">Matching Versions</Card.Title>
        <Container fluid>
          <Row className="g-0 my-2 pb-1 mb-3 border-bottom border-gray border-2">
            <SortIcon
              active={sort.field === 'date'}
              initiallyActive
              lg={2}
              onClick={() => handleSortClick('date')}
            >
              Release Date
            </SortIcon>
            <Col className="text-center" lg={2}>
              LTS
            </Col>
            <SortIcon
              active={sort.field === 'node'}
              className="text-end"
              lg={3}
              onClick={() => handleSortClick('node')}
            >
              Node.js Version
            </SortIcon>
            <SortIcon
              active={sort.field === 'npm'}
              className="text-end"
              lg={3}
              onClick={() => handleSortClick('npm')}
            >
              NPM Version
            </SortIcon>
            <SortIcon
              active={sort.field === 'modules'}
              className="text-end"
              lg={2}
              onClick={() => handleSortClick('modules')}
            >
              Module Version
            </SortIcon>
          </Row>
          {data.length ? (
            <List
              className="container container-fluid"
              rowComponent={ResultRow}
              rowCount={data.length}
              rowHeight={38}
              rowProps={{ data }}
            />
          ) : (
            <Alert variant="warning">No matching releases.</Alert>
          )}
          <Row className="g-0">
            <Col className="text-end">
              Package metadata graciously provided by{' '}
              <a
                href="https://npmjs.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                NPM
              </a>
              .
            </Col>
          </Row>
        </Container>
      </Card>
    </Fragment>
  );
}
