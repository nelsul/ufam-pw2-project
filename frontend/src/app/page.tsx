"use client";

import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: string;
  stock: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetch("/api/product")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  const addToCart = async (productId: string) => {
    try {
      const res = await fetch("/api/purchase/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (res.ok) {
        setMessage("Product added to cart!");
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await res.json();
        setMessage(`Error: ${data.message}`);
      }
    } catch {
      setMessage("Failed to add to cart.");
    }
  };

  if (loading)
    return (
      <Container className="mt-4">
        <p>Loading...</p>
      </Container>
    );
  if (!user) return null;

  return (
    <Container className="mt-4">
      <h1>Products</h1>
      {message && <Alert variant="info">{message}</Alert>}
      <Row>
        {products.map((product) => (
          <Col key={product.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>
                  Price: ${product.price} <br />
                  Stock: {product.stock}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => addToCart(product.id)}
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
