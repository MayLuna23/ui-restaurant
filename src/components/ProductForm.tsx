// src/components/ProductForm.tsx

import { Form, Input, InputNumber, Button, message } from "antd";
import { useState } from "react";
import { createProduct } from "@/api/products";

const ProductForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: { name: string; price: number }) => {
    setLoading(true);
    try {
      const jwt = localStorage.getItem("jwt") || "";
      const response = await createProduct(values, jwt);
      console.log(response);
      if (response.success) {
        message.success("Product created successfully ✅");
        form.resetFields();
        onSuccess?.();
      } else {
        message.error(response.error || "Error creating product ❌");
      }
    } catch (error) {
      message.error("Error creating product");
      console.error(`❌ ${error} `);
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
          { required: true, message: "Por favor escribe un nombre" },
          {
            validator: (_, value) =>
              typeof value === "string" && value.trim().length > 0
                ? Promise.resolve()
                : Promise.reject(
                    new Error("El nombre no puede estar vacío o en blanco")
                  ),
          },
        ]}
      >
        <Input placeholder="Ej: Hamburguesa doble" />
      </Form.Item>

      <Form.Item
        label="Precio"
        name="price"
        rules={[
          { required: true, message: "Por favor escribe un precio" },
          {
            type: "number",
            min: 0.01,
            message: "El precio debe ser mayor a 0",
          },
        ]}
      >
        <InputNumber
          placeholder="Ej: 25000"
          min={0}
          step={100}
          className="w-full"
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
