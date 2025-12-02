"use client";

import { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Form, Alert } from "react-bootstrap";

interface Product {
  id: string;
  name: string;
  price: string;
  stock: number;
  deletedAt?: string | null;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: "", price: "", stock: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchProducts = () => {
    fetch("/api/product?includeDeleted=true")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setError("Failed to load products"));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleShow = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: "", price: "", stock: "" });
    }
    setShowModal(true);
    setError(null);
  };

  const handleClose = () => setShowModal(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const url = editingProduct
      ? `/api/product/${editingProduct.id}`
      : "/api/product";
    const method = editingProduct ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      if (res.ok) {
        setSuccess(editingProduct ? "Product updated" : "Product created");
        fetchProducts();
        handleClose();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const data = await res.json();
        setError(data.message || "Operation failed");
      }
    } catch {
      setError("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/product/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccess("Product deleted");
        fetchProducts();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const data = await res.json();
        setError(data.message || "Delete failed");
      }
    } catch {
      setError("An error occurred");
    }
  };

  const handleReactivate = async (id: string) => {
    if (!confirm("Are you sure you want to reactivate this product?")) return;

    try {
      const res = await fetch(`/api/product/${id}/reactivate`, {
        method: "PATCH",
      });
      if (res.ok) {
        setSuccess("Product reactivated");
        fetchProducts();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const data = await res.json();
        setError(data.message || "Reactivation failed");
      }
    } catch {
      setError("An error occurred");
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Manage Products</h2>
        <Button variant="primary" onClick={() => handleShow()}>
          Add New Product
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className={product.deletedAt ? "table-secondary" : ""}
            >
              <td>
                {product.name}
                {product.deletedAt && (
                  <span className="badge bg-danger ms-2">Deleted</span>
                )}
              </td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                {product.deletedAt ? (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleReactivate(product.id)}
                  >
                    Reactivate
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShow(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? "Edit Product" : "Add Product"}
          </Modal.Title>
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
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
