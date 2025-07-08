import { Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Order {
  orderId: number;
  total: number;
  createdAt: string;
  orderItems: {
    product: {
      name: string;
    };
    quantity: number;
  }[];
}

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Error al obtener órdenes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) =>
        new Date(date).toLocaleString('es-CO', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
    },
    {
      title: 'Productos',
      dataIndex: 'orderItems',
      key: 'products',
      render: (items: Order['orderItems']) => (
        <>
          {items.map((item, index) => (
            <Tag color="blue" key={index}>
              {item.product.name} × {item.quantity}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (value: number) =>
        `$ ${value.toLocaleString('es-CO', {
          style: 'decimal',
          minimumFractionDigits: 0,
        })}`,
    },
  ];

  return (
    <Table
      rowKey="orderId"
      columns={columns}
      dataSource={orders}
      loading={loading}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default OrderList;
