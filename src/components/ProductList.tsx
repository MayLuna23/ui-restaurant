import { Table } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  productId: number;
  name: string;
  price: number;
  createdAt: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error al obtener productos', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Table
      rowKey="productId"
      dataSource={products}
      loading={loading}
      // pagination={{ pageSize: 5 }}
      columns={[
        {
          title: 'Name',
          dataIndex: 'name',
        },
        {
          title: 'Price',
          dataIndex: 'price',
          render: (value: number) =>
            `$ ${value.toLocaleString('es-CO', {
              style: 'decimal',
              minimumFractionDigits: 0,
            })}`,
        },
        {
          title: 'Fecha de creación',
          dataIndex: 'createdAt',
          render: (value: string) =>
            new Date(value).toLocaleDateString('es-CO'),
        },
      ]}
    />
  );
};

export default ProductList;
