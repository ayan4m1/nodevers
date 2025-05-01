import { useFormik } from 'formik';
import { validRange } from 'semver';
import { KeyboardEvent, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { faRefresh, faUndo } from '@fortawesome/free-solid-svg-icons';

import { FilterOptions, NodeFormContext } from '../../types';

interface IProps {
  onFilterChange: (values: NodeFormContext) => void | Promise<void>;
}

export default function FilterForm({ onFilterChange }: IProps) {
  const { values, handleChange, handleSubmit, handleReset } =
    useFormik<NodeFormContext>({
      initialValues: {
        desiredAppName: 'node',
        term: ''
      },
      validateOnChange: false,
      validate: (vals) => {
        const result: FilterOptions = {
          desiredAppName: null,
          term: ''
        };

        if (!validRange(vals.term)) {
          result.term = 'Invalid semver expression.';
        }

        return result;
      },
      onSubmit: onFilterChange
    });
  const handleKeyUp = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.code === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <Row className="mb-4">
      <Col xs={12}>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputGroup.Text>Find versions of </InputGroup.Text>
            <Form.Select
              name="desiredAppName"
              onChange={handleChange}
              style={{ maxWidth: 100 }}
              value={values.desiredAppName}
            >
              <option value="node">Node.js</option>
              <option value="npm">NPM</option>
            </Form.Select>
            <InputGroup.Text>
              {' '}
              for which the version of{' '}
              <strong className="mx-1">
                {values.desiredAppName === 'node' ? 'NPM' : 'Node.js'}
              </strong>{' '}
              matches{' '}
            </InputGroup.Text>
            <Form.Control
              className="mx-2"
              name="term"
              onChange={handleChange}
              onKeyUp={handleKeyUp}
              placeholder='a semver expression (e.g. "1.2.x", "^8.0.0")'
              type="text"
              value={values.term}
            />
            <Button type="submit" variant="primary">
              <FontAwesomeIcon icon={faRefresh} /> Update
            </Button>
            <Button
              onClick={(e) => {
                handleReset(e);
                handleSubmit();
              }}
              variant="warning"
            >
              <FontAwesomeIcon icon={faUndo} /> Reset
            </Button>
          </InputGroup>
        </Form>
      </Col>
    </Row>
  );
}
