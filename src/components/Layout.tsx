import { Fragment } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxesPacking,
  faSearch,
  faTableCells
} from '@fortawesome/free-solid-svg-icons';

export default function Layout() {
  return (
    <Fragment>
      <Navbar expand="lg" variant="dark">
        <Container>
          <Navbar.Brand>
            <Nav.Link as={Link} to="/">
              nodevers
            </Nav.Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav>
              <Nav.Link as={Link} to="/package">
                <FontAwesomeIcon icon={faBoxesPacking} /> Packages
              </Nav.Link>
              <Nav.Link as={Link} to="/support-matrix">
                <FontAwesomeIcon icon={faTableCells} /> Support Matrix
              </Nav.Link>
              <Nav.Link as={Link} to="/package/audit">
                <FontAwesomeIcon icon={faSearch} /> Auditor
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="h-100">
        <Outlet />
      </Container>
    </Fragment>
  );
}
