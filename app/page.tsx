"use client";

import { useProducts } from "./hooks/useProducts";
import ProductList from "./components/ProductList";
import CartList from "./components/CartList";

export default function Home() {
  const { products, loading, error } = useProducts();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        Error loading products: {error.message}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">Grocery Store</h1>
      </header>
      <div className="flex flex-col md:flex-row gap-8">
        <main className="flex-grow">
          <ProductList products={products} />
        </main>
        <aside className="w-full md:w-1/4">
          <CartList />
        </aside>
      </div>
    </div>
  );
}
