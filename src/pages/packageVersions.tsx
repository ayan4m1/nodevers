import { useFormik } from 'formik';
import { List } from 'react-window';
import { Fragment, useEffect } from 'react';
import { ButtonGroup, Card, Col, Container, Row } from 'react-bootstrap';
import { faCode } from '@fortawesome/free-solid-svg-icons';

import LinkButton from '../components/LinkButton';
import SuspenseFallback from '../components/SuspenseFallback';
import FilterForm from '../components/packageVersions/FilterForm';
import usePackageVersionData from '../hooks/usePackageVersionData';
import { ResultRow } from '../components/packageVersions/ResultRow';
import useBundleData from '../hooks/useBundleData';
import { PackageFormContext } from '../types';
import { getCodeBrowserUrl, getPageTitle } from '../utils';

export function Component() {
  const {
    data: bundleData,
    error: bundleError,
    loading: bundleLoading,
    fetchData: fetchBundleData
  } = useBundleData();
  const form = useFormik<PackageFormContext>({
    initialValues: {
      name: 'lodash',
      version: ''
    },
    onSubmit: () => {}
  });
  const { data, error, loading } = usePackageVersionData(form.values);

  useEffect(() => {
    if (!error && !loading && data?.versions?.length) {
      fetchBundleData(data);
    }
  }, [data, error, loading, fetchBundleData]);

  if (loading || bundleLoading) {
    return <SuspenseFallback />;
  } else if (error || bundleError) {
    throw error ?? bundleError;
  }

  return (
    <Fragment>
      <title>{getPageTitle('Package Versions')}</title>
      <FilterForm {...form} />
      {data !== undefined && (
        <Fragment>
          <Row>
            <Col xs={10}>
              <h1>Package {data.name}</h1>
              <h2>Latest version is {data.latestVersion}</h2>
            </Col>
            <Col className="d-flex h-100 justify-content-end" xs={2}>
              <ButtonGroup>
                <LinkButton
                  href={getCodeBrowserUrl(data.name)}
                  icon={faCode}
                  title="View Contents"
                />
              </ButtonGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Card body>
                <Card.Title className="mb-4 text-light">
                  Matching Versions
                </Card.Title>
                <Container className="text-white">
                  <Row>
                    <Col className="text-end border-bottom border-2 pb-1 mb-2">
                      Version
                    </Col>
                    <Col className="text-end border-bottom border-2 pb-1 mb-2">
                      Bundle Size
                    </Col>
                    <Col className="text-center border-bottom border-2 pb-1 mb-2">
                      View Graph
                    </Col>
                  </Row>
                  <List
                    className="container container-fluid"
                    rowComponent={ResultRow}
                    rowCount={Object.values(data.versions).length}
                    rowHeight={30.3}
                    rowProps={{
                      bundleData,
                      packageName: data.name,
                      packages: Object.values(data.versions)
                    }}
                  />
                  <Row className="mt-4">
                    <Col className="text-end" xs={12}>
                      Bundle size kindly provided by{' '}
                      <a
                        href="https://bundlephobia.com"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        bundlephobia
                      </a>
                      .
                    </Col>
                  </Row>
                </Container>
              </Card>
            </Col>
          </Row>
        </Fragment>
      )}
    </Fragment>
  );
}
