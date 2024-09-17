import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { validRange } from 'semver';
import { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { faRefresh, faUndo } from '@fortawesome/free-solid-svg-icons';

export default function FilterForm({ onFilterChange }) {
  const { values, handleChange, handleSubmit, handleReset } = useFormik({
    initialValues: {
      desiredAppName: 'node',
      term: ''
    },
    validateOnChange: false,
    validate: (vals) => {
      const result = {};

      if (!validRange(vals.term)) {
        result.term = 'Invalid semver expression.';
      }

      return result;
    },
    onSubmit: onFilterChange
  });
  const handleKeyUp = useCallback(
    (event) => {
      if (event.code === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <Row className="mb-4">
      <Col xs={12}>
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
          <Button onClick={handleSubmit} variant="primary">
            <FontAwesomeIcon icon={faRefresh} /> Update
          </Button>
          <Button
            onClick={() => {
              handleReset();
              handleSubmit();
            }}
            variant="warning"
          >
            <FontAwesomeIcon icon={faUndo} /> Reset
          </Button>
        </InputGroup>
      </Col>
    </Row>
  );
}

FilterForm.propTypes = {
  onFilterChange: PropTypes.func.isRequired
};
