import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';

const ProductsPage = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Productos 🍔</h2>
      <ProductForm onSuccess={() => window.location.reload()} />
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">Lista de productos</h3>
        <ProductList />
      </div>
    </div>
  );
};

export default ProductsPage;
