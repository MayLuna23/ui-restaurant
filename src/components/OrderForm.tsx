import { Form, Select, InputNumber, Button, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CustomNotification } from "./Notification";
import { createOrder } from "@/api/orders";
import { fetchProductsReq } from "@/api/products";

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
  const [isMobile, setIsMobile] = useState(false);
const [form] = Form.useForm();

  const fetchProducts = async () => {
    try {
      const jwt = localStorage.getItem("jwt") || "";
      const res = await fetchProductsReq(jwt);
      setProducts(res.data.data);
    } catch (err) {
      CustomNotification({
        type: "error",
        message: "Error al obtener productos",
      });
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const handleSubmit = async () => {
    if (items.length === 0) {
      CustomNotification({
        type: "warning",
        message: "Selecciona al menos un producto",
      });
      return;
    }

    setLoading(true);
    try {
      const jwt = localStorage.getItem("jwt") || "";
      console.log(items);
      const response = await createOrder({ items: items }, jwt);
      console.log(response);
      CustomNotification({
        type: "success",
        message: "Orden creada exitosamente",
        description: "Tu orden fue registrada correctamente.",
      });
      setItems([]);
      form.resetFields();
    } catch (err) {
      CustomNotification({
        type: "error",
        message: "Error al crear orden",
        description: "Intenta nuevamente más tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxHeight: "80vh",
        paddingRight: 16,
      }}
    >
      <main className="flex flex-row gap-2">
        {/* Columna izquierda */}
        <section
          className="md:w-2/3 w-full pr-4 min-h-[75vh] rounded-2xl p-5"
          style={{ backgroundColor: "var(--color-peach-lighter)" }}
        >
            <Title level={3} className="mb-4">
              Create Order
            </Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="h-full flex flex-col justify-between"
          >
            <Form.Item label="" name="products">
              <Select
                mode="multiple"
                placeholder="Products"
                onChange={handleSelect}
                value={items.map((item) => item.productId)}
                maxTagCount={isMobile ? 0 : undefined} // oculta los tags en mobile pero mantiene el input funcional
                showSearch
                filterOption={(input, option) =>
                  option?.children
                    ?.toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {products.map((product) => (
                  <Option key={product.productId} value={product.productId}>
                    {product.name} - ${product.price.toLocaleString("es-CO")}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div>
              <Title level={4}>Total: ${total.toLocaleString("es-CO")}</Title>

              <Form.Item>
                <Button style={{marginBottom: "12px"}} type="primary" htmlType="submit" loading={loading}>
                  Create
                </Button>
              </Form.Item>
            </div>
          </Form>
        </section>

        {/* Columna derecha con scroll */}
        <section
          className="md:w-1/3 w-full pl-4 overflow-y-auto max-h-[75vh] rounded-2xl p-5"
          style={{ backgroundColor: "var(--color-peach-lighter)" }}
        >
          <Title level={4} className="mb-4">
            Order Items - Select Quantity
          </Title>
          {items.map((item) => {
            const product = products.find(
              (p) => p.productId === item.productId
            );
            return (
              <Form.Item
                key={item.productId}
                label={`${product?.name} - $ ${product?.price.toLocaleString(
                  "es-CO"
                )}`}
                labelCol={{ span: 24 }}
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
        </section>
      </main>
    </div>
  );
};

export default OrderForm;
