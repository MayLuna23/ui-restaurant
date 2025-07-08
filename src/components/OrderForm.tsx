import {
  Form,
  Select,
  InputNumber,
  Button,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CustomNotification } from "./Notification";

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

  const fetchProducts = async () => {
    try {
      // const res = await axios.get('http://localhost:3000/api/products');
      // setProducts(res.data);
      setProducts([
        { productId: 1, name: "Hamburguesa Mar y Tierra", price: 10000 },
        { productId: 2, name: "Producto B", price: 20000 },
        { productId: 3, name: "Producto C", price: 30000 },
        { productId: 4, name: "Producto D", price: 40000 },
        { productId: 5, name: "Producto E", price: 50000 },
        { productId: 6, name: "Producto F", price: 60000 },
        { productId: 7, name: "Producto G", price: 70000 },
        { productId: 8, name: "Producto H", price: 80000 },
        { productId: 9, name: "Producto I", price: 90000 },
        { productId: 10, name: "Producto J", price: 100000 },
        { productId: 11, name: "Producto K", price: 110000 },
        { productId: 12, name: "Producto L", price: 120000 },
        { productId: 13, name: "Producto M", price: 130000 },
        { productId: 14, name: "Producto N", price: 140000 },
        { productId: 15, name: "Producto O", price: 150000 },
      ]);
    } catch (err) {
      CustomNotification({
        type: "error",
        message: "Error al obtener productos",
      });
    }
  };

  useEffect(() => {
    const selectedProducts = items.map((item) => {
      const product = products.find((p) => p.productId === item.productId);
      return {
        ...product,
        quantity: item.quantity,
      };
    });
    console.log("🧾 Productos seleccionados:", selectedProducts);
  }, [items, products]);

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
      // await axios.post("http://localhost:3000/api/orders", {
      //   items,
      //   total,
      // });
      CustomNotification({
        type: "success",
        message: "Orden creada exitosamente",
        description: "Tu orden fue registrada correctamente.",
      });
      setItems([]);
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
        <section className="md:w-2/3 w-full pr-4 min-h-[75vh] rounded-2xl p-5"  style={{ backgroundColor: "var(--color-peach-lighter)" }}>
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            className="h-full flex flex-col justify-between"
          >
            <Form.Item label="Selecciona productos">
              <Select
                mode="multiple"
                placeholder="Elige productos"
                onChange={handleSelect}
                value={items.map((item) => item.productId)}
                tagRender={isMobile ? () => null : undefined}
              
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
                <Button type="primary" htmlType="submit" loading={loading}>
                  Crear orden
                </Button>
              </Form.Item>
            </div>
          </Form>
        </section>

        {/* Columna derecha con scroll */}
        <section className="md:w-1/3 w-full pl-4 overflow-y-auto max-h-[75vh] rounded-2xl p-5" style={{backgroundColor: "var(--color-peach-lighter)" }}>
          {items.map((item) => {
            const product = products.find(
              (p) => p.productId === item.productId
            );
            return (
              <Form.Item
                key={item.productId}
                label={`Cantidad de ${product?.name} - $ ${product?.price.toLocaleString("es-CO")}`}
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
