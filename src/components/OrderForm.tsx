import { Form, Select, InputNumber, Button, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CustomNotification } from "./Notification";
import { createOrder } from "@/api/orders";
import { fetchProductsReq } from "@/api/products";
import { useIsMobile } from "@/hooks/useIsMobile";

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
  const isMobile = useIsMobile();
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
      message: "Please select at least one product",
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
      message: "Order created successfully",
      description: "Your order has been placed correctly.",
    });
    setItems([]);
    form.resetFields();
  } catch (err) {
    CustomNotification({
      type: "error",
      message: "Error creating order",
      description: "Please try again later.",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      style={{
        maxHeight: "80vh",
      }}
    >
      <main style={{flexDirection: isMobile ? "column" : "row", height: isMobile ? "71vh" : "75vh"}} className="flex gap-2 lg:w-4/5 m-auto">
        {/* Columna izquierda */}
        <section
          className=" w-full pr-4  rounded-2xl p-5"
          style={{ backgroundColor: "var(--color-peach-lighter)", height: isMobile ? "40vh" : "70vh" }}
        >
          <Title style={{color: "#633219"}} level={4} className="mb-4">
            Select Products
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
              <Title style={{color: "#633219"}} level={4}>Total: ${total.toLocaleString("es-CO")}</Title>

              <Form.Item>
                <Button
                  style={{ marginBottom: isMobile ? "20px" : "16px", fontSize: isMobile ? "16px" : "20px", width: isMobile ? "80px" : "120px", height: isMobile ? "35px" : "40px", backgroundColor: "var(--color-orange-dark)"  }}
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  Create
                </Button>
              </Form.Item>
            </div>
          </Form>
        </section>

        {/* Columna derecha con scroll */}
        <section
          className="md:w-1/3 w-full pl-4 overflow-y-auto max-h-[75vh] rounded-2xl p-5"
          style={{ backgroundColor: "var(--color-peach-lighter)", height: isMobile ? "40vh" : "70vh" }}
        >
          <Title style={{color: "#633219"}} level={4} className="mb-4">
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
