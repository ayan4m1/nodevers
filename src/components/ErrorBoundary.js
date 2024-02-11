import { Container } from 'react-bootstrap';
import { isRouteErrorResponse, useRouteError } from 'react-router';

export default function ErrorBoundary() {
  const error = useRouteError();

  return (
    <Container>
      <h1>Error</h1>
      {isRouteErrorResponse(error) ? (
        <h1>
          {error.status} {error.statusText}
        </h1>
      ) : (
        <h1>{error.message || error}</h1>
      )}
    </Container>
  );
}
