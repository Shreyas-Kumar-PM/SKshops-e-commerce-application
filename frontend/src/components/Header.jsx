import { Navbar, Nav, Container, Badge, Dropdown } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { totalCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="app-navbar">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="brand-text">
          SK<span className="accent">shops</span>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/category/jerseys">
              Jerseys
            </Nav.Link>
            <Nav.Link as={NavLink} to="/category/shoes">
              Shoes
            </Nav.Link>
            <Nav.Link as={NavLink} to="/category/watches">
              Watches
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={NavLink} to="/cart" className="cart-link">
              Cart{" "}
              {totalCount > 0 && (
                <Badge bg="warning" text="dark">
                  {totalCount}
                </Badge>
              )}
            </Nav.Link>
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-light">
                  {user.name || "User"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/signup">
                  Sign up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
