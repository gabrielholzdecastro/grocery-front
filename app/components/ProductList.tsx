"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

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

export default function ProductList({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<CartResponse | null>(null);

  const addToCart = async (product: Product) => {
    try {
      const response = await fetch(
        `http://localhost:8080/cart/add/${product.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: product.id }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }
      const cartData: CartResponse = await response.json();
      setCart(cartData);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={addToCart}
        />
      ))}
    </div>
  );
}
