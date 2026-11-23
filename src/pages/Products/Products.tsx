import { useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";
import type { Product } from "../../types/product";
import { ProductForm } from "../../components/products/ProductForm";
import { ProductList } from "../../components/products/ProductList";

export function Products() {
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  function handleCancelForm() {
    setIsFormOpen(false);
    setSelectedProduct(null);
  }

  function handleCreateProduct(productData: Omit<Product, "id">) {
    const createdProduct = createProduct(productData);
    setProducts((products) => [...products, createdProduct]);
    handleCancelForm();
  }

  function handleSelectProduct(product: Product) {
    setSelectedProduct(product);
    setIsFormOpen(true);
  }

  function handleUpdateProduct(productData: Omit<Product, "id">) {
    if (!selectedProduct) {
      return;
    }

    const updatedProduct = updateProduct(selectedProduct.id, productData);

    if (updatedProduct) {
      setProducts((products) =>
        products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product,
        ),
      );
      handleCancelForm();
    }
  }

  function handleDeleteProduct(id: string) {
    if (!window.confirm("Tem certeza de que deseja excluir este produto?")) {
      return;
    }

    if (deleteProduct(id)) {
      setProducts((products) =>
        products.filter((product) => product.id !== id),
      );
    }
  }

  return (
    <>
      <button
        type="button"
        className="mb-4 px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors cursor-pointer"
        onClick={() => {
          setSelectedProduct(null);
          setIsFormOpen(true);
        }}
      >
        Novo produto
      </button>
      {isFormOpen && (
        <ProductForm
          key={selectedProduct?.id ?? "new"}
          initialData={selectedProduct}
          onSubmit={(productData) =>
            selectedProduct
              ? handleUpdateProduct(productData)
              : handleCreateProduct(productData)
          }
          onCancel={handleCancelForm}
        />
      )}

      <ProductList
        products={products}
        onEdit={handleSelectProduct}
        onDelete={handleDeleteProduct}
      />
    </>
  );
}
