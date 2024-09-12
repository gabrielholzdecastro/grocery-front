"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartResponse {
  products: Product[];
  finalPrice: number;
  totalPrice: number;
  discount: number;
}

export default function CartList() {
  const [cart, setCart] = useState<CartResponse | null>(null);

  const fetchCart = async () => {
    try {
      const response = await fetch("http://localhost:8080/cart/all");
      if (!response.ok) {
        throw new Error("Failed to retrieve the cart");
      }
      const cartData: CartResponse = await response.json();
      setCart(cartData);
    } catch (error) {
      console.error("Failed to retrieve the cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();

    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const clearCart = async () => {
    try {
      const response = await fetch("http://localhost:8080/cart/clear", {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to clear the cart");
      }
      setCart(null);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Failed to clear the cart:", error);
    }
  };

  if (!cart) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shopping Cart</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your cart is empty.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shopping Cart</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {cart.products.map((item, index) => (
            <li key={index} className="flex justify-between">
              <span>{item.name}</span>
              <span>$ {(item.price / 100).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t flex flex-col">
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>$ {(cart.finalPrice / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Discount:</span>
            <span>$ {(cart.discount / 100).toFixed(2)}</span>
          </div>
        </div>
        <Button onClick={clearCart} className="w-full mt-4">
          Clear Cart
        </Button>
      </CardContent>
    </Card>
  );
}
