import { Fragment } from 'react';
import { RowComponentProps } from 'react-window';
import { Badge, Col, Row } from 'react-bootstrap';
import { faFileText } from '@fortawesome/free-solid-svg-icons';

import LinkButton from '../LinkButton';
import { NodeVersionData } from '../../types';

interface ResultRowProps {
  data: NodeVersionData[];
}

export default function ResultRow({
  index,
  data,
  style
}: RowComponentProps<ResultRowProps>) {
  const { node, npm, lts, modules, date } = data[index];

  return (
    <Row style={style}>
      <Col lg={2}>{date}</Col>
      <Col className="text-center" lg={2}>
        <Badge bg={lts ? 'success' : 'warning'}>
          {lts ? 'LTS' : 'Non-LTS'}
        </Badge>
      </Col>
      <Col className="text-end" lg={3}>
        <span>{node}</span>
        <LinkButton
          className="ms-2"
          href={`https://nodejs.org/en/blog/release/v${node}`}
          icon={faFileText}
          size="sm"
        />
      </Col>
      <Col className="text-end" lg={3}>
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
      </Col>
      <Col className="text-end" lg={2}>
        {modules}
      </Col>
    </Row>
  );
}
