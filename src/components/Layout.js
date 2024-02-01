import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Container, Navbar } from 'react-bootstrap';

export default function Layout({ children }) {
  return (
    <Fragment>
      <Navbar variant="dark">
        <Container>
          <Navbar.Brand>nodevers</Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <main>{children}</main>
      </Container>
    </Fragment>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
