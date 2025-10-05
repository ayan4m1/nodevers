import { major } from 'semver';
import {
  addMonths,
  format,
  formatDistanceToNow,
  isAfter,
  parseISO
} from 'date-fns';
import { Card, Table } from 'react-bootstrap';
import { Fragment, useEffect, useState } from 'react';
import {
  RawSupportMatrixData,
  SupportMatrixData,
  SupportMatrixItem
} from 'src/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faMinusCircle
} from '@fortawesome/free-solid-svg-icons';

import SuspenseFallback from '../components/SuspenseFallback';
import useNodeVersionData from '../hooks/useNodeVersionData';
import { getPageTitle } from '../utils';
import Chart from 'react-google-charts';

export function Component() {
  const [matrix, setMatrix] = useState<SupportMatrixData>([]);
  const { data, error, loading } = useNodeVersionData({
    sort: { field: 'name', direction: true },
    filter: null
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    const matrixData: RawSupportMatrixData = {};

    for (const item of data) {
      const majorVersion = major(item.node);
      const date = parseISO(item.date);

      if (!matrixData[majorVersion]) {
        matrixData[majorVersion] = [];
      }

      matrixData[majorVersion].push({
        node: item.node,
        date,
        lts: item.lts
      });
    }

    const versionList = Object.entries(matrixData).map(
      ([version, versions]) => [parseInt(version, 10), versions]
    ) as [number, SupportMatrixItem[]][];

    versionList.sort((a, b) => b[0] - a[0]);

    setMatrix(versionList);
  }, [data]);

  if (loading) {
    return <SuspenseFallback />;
  } else if (error) {
    throw error;
  }

  return (
    <Fragment>
      <title>{getPageTitle('Node Support Matrix')}</title>
      <Card body>
        <Card.Title>Support Matrix</Card.Title>
        <Chart
          chartType="Timeline"
          data={matrix.map(([version, versions]) => [
            'Version',
            String(version),
            versions[versions.length - 1].date,
            versions[0].date
          ])}
          height="200px"
          options={{
            avoidOverlappingGridLines: false,
            is3D: false,
            backgroundColor: '#1e434a',
            timeline: {
              showRowLabels: false
            }
          }}
          rootProps={{
            className: 'timeline-chart'
          }}
          width="100%"
        />
        <Table striped>
          <thead>
            <tr>
              <th className="text-end" style={{ width: '20%' }}>
                Version Number
              </th>
              <th className="text-center" style={{ width: '10%' }}>
                Is LTS?
              </th>
              <th className="text-end" style={{ width: '10%' }}>
                # of Releases
              </th>
              <th>Appx. End of Support</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map(([version, versions]) => {
              const lts = version > 0 && version % 2 === 0;
              let endOfSupport = new Date();

              if (lts) {
                const reverseVersions = [...versions];

                const firstLtsVersion = reverseVersions
                  .reverse()
                  .find((version) => version.lts);

                endOfSupport = addMonths(
                  firstLtsVersion ? firstLtsVersion.date : new Date(),
                  30
                );
              } else {
                endOfSupport = addMonths(versions[versions.length - 1].date, 6);
              }

              return (
                <tr key={version}>
                  <td className="text-end">{version}</td>
                  <td className="text-center">
                    <FontAwesomeIcon
                      color={lts ? 'rgb(42, 161, 152)' : 'rgb(211, 54, 130)'}
                      icon={lts ? faCheckCircle : faMinusCircle}
                    />{' '}
                    {lts ? 'Yes' : 'No'}
                  </td>
                  <td className="text-end">{versions.length}</td>
                  <td>
                    <FontAwesomeIcon
                      className="me-1"
                      color={
                        isAfter(endOfSupport, Date.now())
                          ? 'rgb(42, 161, 152)'
                          : 'rgb(211, 54, 130)'
                      }
                      icon={
                        isAfter(endOfSupport, Date.now())
                          ? faCheckCircle
                          : faMinusCircle
                      }
                    />
                    {format(endOfSupport, 'yyyy-MM-dd')} (
                    {formatDistanceToNow(endOfSupport, { addSuffix: true })})
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </Fragment>
  );
}
