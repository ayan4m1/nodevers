import { useFormik } from 'formik';
import { Fragment, useEffect } from 'react';
import { ButtonGroup, Card, Col, Row, Table } from 'react-bootstrap';
import { faChartDiagram, faCode } from '@fortawesome/free-solid-svg-icons';

import LinkButton from '../components/LinkButton';
import SuspenseFallback from '../components/SuspenseFallback';
import FilterForm from '../components/packageVersions/FilterForm';
import usePackageVersionData from '../hooks/usePackageVersionData';
import useBundleData from '../hooks/useBundleData';
import { getCodeBrowserUrl, getPageTitle } from '../utils';
import { PackageFormContext } from '../types';
import prettyBytes from 'pretty-bytes';

export function Component() {
  const {
    data: bundleData,
    error: bundleError,
    loading: bundleLoading,
    fetchData: fetchBundleData
  } = useBundleData();
  const formikContext = useFormik<PackageFormContext>({
    initialValues: {
      name: 'lodash',
      version: ''
    },
    onSubmit: () => {}
  });
  const { data, error, loading } = usePackageVersionData(formikContext.values);

  useEffect(() => {
    if (!error && !loading && data?.versions?.length) {
      fetchBundleData({
        name: data.name
      });
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
      <FilterForm formikContext={formikContext} />
      {Boolean(data) && (
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
                  title="View Contents"
                  icon={faCode}
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
                <Table bordered hover striped variant="dark">
                  <thead>
                    <tr>
                      <th className="text-end">Version</th>
                      <th className="text-end">Dependencies</th>
                      <th className="text-end">Bundle Size</th>
                      <th className="text-center">View Graph</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(data.versions).map(({ version }) => {
                      const queryString = new URLSearchParams();

                      queryString.append('q', `${data.name}@${version}`);

                      const versionBundleData = bundleData.find(
                        (bundle) => bundle.version === version
                      );

                      return (
                        <tr key={version}>
                          <td className="text-end">
                            <span>{version}</span>
                          </td>
                          <td className="text-end">
                            {versionBundleData?.dependencies ?? '?'}
                          </td>
                          {versionBundleData?.size ? (
                            <td className="text-end">
                              {prettyBytes(versionBundleData.size)} (
                              {prettyBytes(versionBundleData.gzippedSize)}{' '}
                              gzipped)
                            </td>
                          ) : (
                            <td className="text-end">?</td>
                          )}
                          <td className="text-center">
                            <LinkButton
                              href={`https://npmgraph.js.org/?${queryString.toString()}`}
                              icon={faChartDiagram}
                              size="sm"
                            />
                          </td>
                        </tr>
                      );
                    })}
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
