import { Badge, Table } from 'react-bootstrap';

import Layout from 'components/Layout';
import useNodeVersionData from 'hooks/useNodeVersionData';
import { useCallback, useState } from 'react';

export default function App() {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(true);
  const { data, error, loading } = useNodeVersionData(sortField, sortDirection);

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
        <h1>Error Loading Data!</h1>
        <blockquote>{JSON.stringify(error, null, 2)}</blockquote>
      </Layout>
    );
  }

  return (
    <Layout>
      <Table variant="dark">
        <thead>
          <tr>
            <th onClick={() => handleSortClick('date')}>Release Date</th>
            <th onClick={() => handleSortClick('lts')}>LTS</th>
            <th onClick={() => handleSortClick('node')}>Node.js Version</th>
            <th onClick={() => handleSortClick('npm')}>NPM Version</th>
            <th onClick={() => handleSortClick('modules')}>Module Version</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ node, npm, lts, modules, date }) => (
            <tr key={node}>
              <td>{date}</td>
              <td>
                {lts ? (
                  <Badge bg="success">LTS</Badge>
                ) : (
                  <Badge bg="warning">Non-LTS</Badge>
                )}
              </td>
              <td>{node}</td>
              <td>{npm}</td>
              <td>{modules}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Layout>
  );
}
