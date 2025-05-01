import { FormikProps } from 'formik';
import { useCallback, useState } from 'react';
import { Form, Col, Row, Card } from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

import { PackageFormContext } from '../../types';

type IProps = {
  formikContext: FormikProps<PackageFormContext>;
};

export default function FilterForm({ formikContext }: IProps) {
  const [packageNames, setPackageNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const { handleChange, setFieldValue, values } = formikContext;

  const handleSearchUpdate = useCallback((query: string) => {
    setLoading(true);

    fetch(
      `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}`
    )
      .then((result) => result.json())
      .then(({ objects }) =>
        setPackageNames(objects.map(({ package: { name } }) => name))
      )
      .finally(() => setLoading(false));
  }, []);
  const handleSearchSelect = useCallback(
    ([packageName]) => setFieldValue('name', packageName),
    [setFieldValue]
  );

  return (
    <Row className="mb-4">
      <Col xs={12}>
        <Card body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Package Name</Form.Label>
              <AsyncTypeahead
                defaultInputValue={values.name}
                filterBy={() => true}
                id="package-name"
                isLoading={loading}
                multiple={false}
                onChange={handleSearchSelect}
                onSearch={handleSearchUpdate}
                options={packageNames}
                placeholder={'e.g. "lodash"'}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Semver Expression</Form.Label>
              <Form.Control
                name="version"
                onChange={handleChange}
                type="text"
                value={values.version}
              />
            </Form.Group>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
