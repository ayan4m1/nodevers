import { major } from 'semver';
import { addMonths, format, formatDistanceToNow, parseISO } from 'date-fns';
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
              <th>Version Number</th>
              <th>Is LTS?</th>
              <th>End of Support</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map(([version, versions]) => {
              const lts = version > 0 && version % 2 === 0;
              const endOfSupport = addMonths(
                versions[versions.length - 1].date,
                36
              );

              return (
                <tr key={version}>
                  <td>{version}</td>
                  <td>
                    <FontAwesomeIcon
                      color={lts ? '#00aa00' : '#aa0000'}
                      fixedWidth
                      icon={lts ? faCheckCircle : faMinusCircle}
                    />{' '}
                    {lts ? 'Yes' : 'No'}
                  </td>
                  <td>
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
