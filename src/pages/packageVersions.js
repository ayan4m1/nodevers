import { Fragment } from 'react';
import { useFormik } from 'formik';
import { Helmet } from 'react-helmet';
import { Button, ButtonGroup, Card, Col, Row, Table } from 'react-bootstrap';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getCodeBrowserUrl } from 'utils';
import CustomErrorBoundary from 'components/ErrorBoundary';
import FilterForm from 'components/packageVersions/FilterForm';
import usePackageVersionData from 'hooks/usePackageVersionData';

export const ErrorBoundary = CustomErrorBoundary;

export function Component() {
  const formikContext = useFormik({
    initialValues: {
      name: 'lodash',
      version: ''
    }
  });
  const { data, error, loading } = usePackageVersionData(formikContext.values);

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
      <Helmet title="Package Versions" />
      <FilterForm formikContext={formikContext} />
      {Boolean(data) && (
        <Fragment>
          <Row>
            <Col xs={10}>
              <h1>Package {data.name}</h1>
            </Col>
            <Col className="d-flex h-100 justify-content-end" xs={2}>
              <ButtonGroup>
                <Button
                  as="a"
                  href={getCodeBrowserUrl(data.name)}
                  rel="noopener noreferrer"
                  target="_blank"
                  variant="info"
                >
                  <FontAwesomeIcon icon={faCode} /> GitHub
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>Latest version is {data.latestVersion}</h2>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Card body>
                <Card.Title className="mb-4 text-light">
                  Matching Versions
                </Card.Title>
                <Table bordered hover striped variant="dark">
                  <thead>
                    <tr>
                      <th className="text-end">Version</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(data.versions).map(({ version }) => (
                      <tr key={version}>
                        <td className="text-end">{version}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </Fragment>
      )}
    </Fragment>
  );
}
