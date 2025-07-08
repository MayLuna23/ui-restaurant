import { Form, Input, InputNumber, Button, message } from 'antd';
import { useState } from 'react';
import axios from 'axios';

const ProductForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const onFinish = async (values: { name: string; price: number }) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/api/products', values);
      message.success('Producto creado con éxito ✅');
      form.resetFields();
      onSuccess?.();
    } catch (error) {
      message.error('Error al crear producto ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="max-w-md"
    >
      <Form.Item
  label="Nombre del producto"
  name="name"
  rules={[
    { required: true, message: 'Por favor escribe un nombre' },
    {
      type: 'string',
      message: 'El nombre debe ser un texto',
    },
    {
      validator: (_, value) =>
        typeof value === 'string' && value.trim().length > 0
          ? Promise.resolve()
          : Promise.reject(new Error('El nombre no puede estar vacío o en blanco')),
    },
  ]}
>
  <Input placeholder="Ej: Hamburguesa doble" />
</Form.Item>

      <Form.Item
        label="Precio"
        name="price"
        rules={[
          { required: true, message: 'Por favor escribe un precio' },
          {
            type: 'number',
            min: 0.01,
            message: 'El precio debe ser mayor a 0',
          },
        ]}
      >
        <InputNumber
          placeholder="Ej: 25000"
          min={0}
          step={100}
          className="w-full"
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Crear producto
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;