import { FormikProps, withFormik } from 'formik';
import { useCallback, useState } from 'react';
import { Form, Col, Row, Card } from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

import { PackageData, PackageFormContext } from '../../types';
import { Option } from 'react-bootstrap-typeahead/types/types';

function FilterForm({
  values,
  handleChange,
  setFieldValue
}: FormikProps<PackageFormContext>) {
  const [packageNames, setPackageNames] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchUpdate = useCallback((query: string) => {
    setLoading(true);

    fetch(
      `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}`
    )
      .then((result) => result.json())
      .then(({ objects }) =>
        setPackageNames(
          objects.map(({ package: pkg }: { package: PackageData }) => pkg.name)
        )
      )
      .finally(() => setLoading(false));
  }, []);
  const handleSearchSelect = useCallback(
    (packageNames: Option[]) => setFieldValue('name', packageNames[0]),
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

export default withFormik<object, PackageFormContext>({
  mapPropsToValues: () => ({
    name: 'lodash',
    version: ''
  }),
  handleSubmit: () => {}
})(FilterForm);
