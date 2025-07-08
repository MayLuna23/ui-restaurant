import {
  Form,
  Select,
  InputNumber,
  Button,
  Divider,
  message,
  Typography,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const { Option } = Select;
const { Title } = Typography;

interface Product {
  productId: number;
  name: string;
  price: number;
}

interface ProductItem {
  productId: number;
  quantity: number;
}

const OrderForm = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/products');
      setProducts(res.data);
    } catch (err) {
      message.error('Error al obtener productos');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSelect = (selectedIds: number[]) => {
    const newItems = selectedIds.map((id) => {
      const existing = items.find((item) => item.productId === id);
      return existing || { productId: id, quantity: 1 };
    });
    setItems(newItems);
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = products.find((p) => p.productId === item.productId);
      return product ? sum + product.price * item.quantity : sum;
    }, 0);
  }, [items, products]);

  const onFinish = async () => {
    if (items.length === 0) {
      message.warning('Selecciona al menos un producto');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:3000/api/orders', {
        items,
        total,
      });
      message.success('Orden creada exitosamente');
      setItems([]);
    } catch (err) {
      message.error('Error al crear orden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item label="Selecciona productos">
        <Select
          mode="multiple"
          placeholder="Elige productos"
          onChange={handleSelect}
          value={items.map((item) => item.productId)}
        >
          {products.map((product) => (
            <Option key={product.productId} value={product.productId}>
              {product.name} - ${product.price.toLocaleString('es-CO')}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {items.map((item) => {
        const product = products.find((p) => p.productId === item.productId);
        return (
          <Form.Item
            key={item.productId}
            label={`Cantidad de ${product?.name}`}
          >
            <InputNumber
              min={1}
              value={item.quantity}
              onChange={(value) =>
                handleQuantityChange(item.productId, value || 1)
              }
            />
          </Form.Item>
        );
      })}

      <Divider />

      <Title level={4}>Total: ${total.toLocaleString('es-CO')}</Title>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Crear orden
        </Button>
      </Form.Item>
    </Form>
  );
};

export default OrderForm;
