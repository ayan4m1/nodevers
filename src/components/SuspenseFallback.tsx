import { Row, Col, Spinner, Container } from 'react-bootstrap';

export default function SuspenseFallback() {
  return (
    <Container className="h-100 w-100 d-flex flex-column justify-content-center">
      <Row>
        <Col className="text-center">
          <h1>Loading...</h1>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <Spinner animation="border" className="my-3" />
        </Col>
      </Row>
    </Container>
  );
}
