"use client";

import Link from "next/link";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useAuth } from "@/context/AuthContext";

export default function AppNavbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} href="/">
          Icomp Store
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} href="/cart">
              Cart
            </Nav.Link>
            {user.userType === "ADMIN" && (
              <>
                <Nav.Link as={Link} href="/admin/users">
                  Users
                </Nav.Link>
                <Nav.Link as={Link} href="/admin/products">
                  Products
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            <Button variant="outline-light" onClick={logout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
