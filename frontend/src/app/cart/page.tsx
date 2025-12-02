"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Table, Button, Alert } from "react-bootstrap";

interface Product {
  id: string;
  name: string;
  price: string;
}

interface PurchaseItem {
  id: string;
  quantity: number;
  price: string;
  product: Product;
}

interface Purchase {
  id: string;
  total: string;
  purchaseItems: PurchaseItem[];
}

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState<Purchase | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = () => {
    fetch("/api/purchase")
      .then((res) => {
        if (res.status === 401) {
          setError("Please login to view cart");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setCart(data);
      })
      .catch(() => setError("Failed to load cart"));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const finishPurchase = async () => {
    try {
      const res = await fetch("/api/purchase/finish", {
        method: "POST",
      });

      if (res.ok) {
        setMessage(
          "Purchase completed successfully! Redirecting to products...",
        );
        setCart(null);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to finish purchase");
      }
    } catch {
      setError("An error occurred");
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/purchase/item/${itemId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const updatedCart = await res.json();
        setCart(updatedCart);
        setMessage("Item removed from cart");
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to remove item");
      }
    } catch {
      setError("An error occurred");
    }
  };

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!cart) {
    return (
      <Container className="mt-4">
        <p>Loading cart...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Shopping Cart</h2>
      {message && <Alert variant="success">{message}</Alert>}

      {cart.purchaseItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.purchaseItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.product.name}</td>
                  <td>${item.price}</td>
                  <td>{item.quantity}</td>
                  <td>${(Number(item.price) * item.quantity).toFixed(2)}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between align-items-center">
            <h4>Total: ${cart.total}</h4>
            <Button variant="success" onClick={finishPurchase}>
              Finish Purchase
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}
