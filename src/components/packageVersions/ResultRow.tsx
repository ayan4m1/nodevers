import prettyBytes from 'pretty-bytes';
import { Col, Row } from 'react-bootstrap';
import { RowComponentProps } from 'react-window';
import { faChartDiagram } from '@fortawesome/free-solid-svg-icons';

import LinkButton from '../LinkButton';
import { BundleData, PackageData } from '../../types';

type ResultRowProps = {
  packageName: string;
  packages: PackageData[];
  bundleData: BundleData[] | undefined;
};

export function ResultRow({
  index,
  packages,
  bundleData,
  packageName,
  style
}: RowComponentProps<ResultRowProps>) {
  const { version } = packages[index];
  const queryString = new URLSearchParams();

  queryString.append('q', `${packageName}@${version}`);

  const versionBundleData = bundleData?.find(
    (bundle) => bundle.version === version
  );

  return (
    <Row className="g-0 py-2" style={style}>
      <Col className="text-end">
        <span>{version}</span>
      </Col>
      {versionBundleData?.size ? (
        <Col className="text-end">
          {prettyBytes(versionBundleData.size)} (
          {prettyBytes(versionBundleData.gzippedSize)} gzipped)
        </Col>
      ) : (
        <Col className="text-end">?</Col>
      )}
      <Col className="text-center">
        <LinkButton
          href={`https://npmgraph.js.org/?${queryString.toString()}`}
          icon={faChartDiagram}
          size="sm"
        />
      </Col>
    </Row>
  );
}
