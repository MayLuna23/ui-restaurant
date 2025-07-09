// src/components/ProductForm.tsx

import { Form, Input, InputNumber, Button, message } from "antd";
import { useState } from "react";
import { createProduct } from "@/api/products";
import { useIsMobile } from "@/hooks/useIsMobile";

const ProductForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: { name: string; price: number }) => {
    setLoading(true);
    try {
      const jwt = localStorage.getItem("jwt") || "";
      const response = await createProduct(values, jwt);
      if (response.success) {
        message.success("Product created successfully ✅");
        form.resetFields();
        onSuccess?.();
      } else {
        message.error(response.error || "Error creating product");
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
      style={{ width: "90vw"}}
    >
      <Form.Item
      // style={{color: "var(--color-brown-light)"}}
        label={
            <span style={{ color: "var(--color-brown-light)" }}>
              Product Name
            </span>}
        name="name"
        rules={[
          { type: "string", required: true, message: "Please write a name" },
          {
            validator: (_, value) => {
              if (typeof value !== "string" || value.trim().length === 0) {
                return Promise.reject(
                  new Error("The name cannot be empty or blank")
                );
              }

              if (/\d/.test(value)) {
                return Promise.reject(
                  new Error("The name cannot contain numbers")
                );
              }

              return Promise.resolve();
            },
          },
        ]}
      >
        <Input placeholder="E.g. Classic Burger" />
      </Form.Item>

      <Form.Item
        label={
            <span style={{ color: "var(--color-brown-light)" }}>
              Price
            </span>}
        name="price"
        rules={[
          { required: true, message: "Please write a price" },
          {
            type: "number",
            min: 1,
            message: "The price must be greater than 0",
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
        <Button style={{ backgroundColor: "var(--color-orange-dark)" }} type="primary" htmlType="submit" loading={loading}>
          Create
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;
