import { useEffect, useState } from "react";
import ProductForm from "../components/products/ProductForm";
import ProductList from "../components/products/ProductList";
import { fetchProductsReq } from "@/api/products";
import { useAuth } from "@/context/AuthContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";

interface Product {
  productId: number;
  name: string;
  price: number;
  createdAt: string;
}

const ProductsPage = () => {
  useDocumentTitle("Products | Ocean App");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMssg, setErrorMssg] = useState("");
  const { isAdmin } = useAuth();
  const getProducts = async () => {
    setLoading(true);
    try {
      const jwt = localStorage.getItem("jwt") || "";
      const res = await fetchProductsReq(jwt);

      res.success ? setProducts(res.data?.data || []) : setProducts([]);
    } catch (err) {
      setErrorMssg("Error al obtener productos");
      console.error("Error al obtener productos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      <h2  className="text-2xl font-semibold mb-6 color-brown-light text-center">Products</h2>

      {isAdmin && (
        <div className="w-100vw grid place-content-center">
          <ProductForm onSuccess={getProducts} />
        </div>
      )}

      <div  className="mt-10">
        <ProductList products={products} loading={loading} error={errorMssg} />
      </div>
    </div>
  );
};

export default ProductsPage;
