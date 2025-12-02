"use client";

import { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Form, Alert } from "react-bootstrap";

interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "CLIENT",
    password: "",
  });

  const fetchUsers = () => {
    fetch("/api/user")
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch(() => setError("Failed to load users. Are you an admin?"));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleShow = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      userType: user.userType,
      password: "", 
    });
    setShowModal(true);
    setError(null);
  };

  const handleClose = () => setShowModal(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!editingUser) return;

    const updateData: {
      name: string;
      email: string;
      userType: string;
      password?: string;
    } = {
      name: formData.name,
      email: formData.email,
      userType: formData.userType,
    };

    if (formData.password) {
      updateData.password = formData.password;
    }

    try {
      const res = await fetch(`/api/user/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        setSuccess("User updated successfully");
        fetchUsers();
        handleClose();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const data = await res.json();
        setError(data.message || "Update failed");
      }
    } catch {
      setError("An error occurred");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Admin Dashboard - Users</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.userType}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleShow(user)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={formData.userType}
                onChange={(e) =>
                  setFormData({ ...formData, userType: e.target.value })
                }
              >
                <option value="CLIENT">CLIENT</option>
                <option value="ADMIN">ADMIN</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                New Password (leave blank to keep current)
              </Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="New password"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
