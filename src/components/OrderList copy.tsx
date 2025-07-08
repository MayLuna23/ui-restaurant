import { useEffect, useState } from "react";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";
import {
  Modal,
  Tooltip,
  DatePicker,
  InputNumber,
  Button,
  Form,
  Space,
  message,
} from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

interface Order {
  orderId: number;
  total: number;
  createdAt: string;
  user: {
    name: string;
  };
  OrderItem: {
    quantity: number;
    product: {
      name: string;
    };
  }[];
}

      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsIm5hbWUiOiJNYXlyYSBMb3BleiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoibWF5cmEyQGV4YW1wbGUuY29tIiwiY3JlYXRlZEF0IjoiMjAyNS0wNy0wOFQwMTozNzo0MC41MTRaIiwiaWF0IjoxNzUxOTM5Mjc2fQ._CUKnr365IdS0F5ADZnkO1n6EeKgLGFpUK9LTLbdAFs";


const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:3000/api/v1/restaurant/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data.data);
    } catch (err) {
      console.error("Error al obtener órdenes", err);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = async () => {
  const {
    totalRange = {},
    startDate,
    endDate,
  } = form.getFieldsValue();

  const payload: any = {};

  if (totalRange.min != null) payload.minTotal = totalRange.min;
  if (totalRange.max != null) payload.maxTotal = totalRange.max;

  if (startDate) payload.startDate = dayjs(startDate).format("YYYY-MM-DD");
  if (endDate) payload.endDate = dayjs(endDate).format("YYYY-MM-DD");

  // 🔴 Validaciones
  if (payload.minTotal != null && payload.maxTotal != null) {
    if (payload.minTotal > payload.maxTotal) {
      message.error("Minimum total cannot be greater than maximum total.");
      return;
    }
  }

  if (startDate && endDate) {
    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      message.error("Start date cannot be after end date.");
      return;
    }
  }

  if (Object.keys(payload).length === 0) {
    message.warning("Please select at least one filter.");
    return;
  }

  setLoading(true);
  try {
    const res = await axios.post(
      "http://localhost:3000/api/v1/restaurant/orders/filter",
      payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    );
    setOrders(res.data.data);
  } catch (err: any) {
    const msg = err?.response?.data?.message || "Error filtering orders";
    message.error(msg);
  } finally {
    setLoading(false);
  }
};

  const handleDelete = (orderId: number) => {
    Modal.confirm({
      title: "¿Estás seguro de eliminar esta orden?",
      content: "Esta acción no se puede deshacer.",
      okText: "Eliminar",
      cancelText: "Cancelar",
      okType: "danger",
      centered: true,
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:3000/api/orders/${orderId}`);
          setOrders((prev) =>
            prev.filter((order) => order.orderId !== orderId)
          );
        } catch (err) {
          console.error("Error al eliminar la orden", err);
        }
      },
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="">
      {/* Filtros */}
      <Form
        form={form}
        layout="inline"
        className="flex justify-center flex-wrap md:gap-4 md:mb-12"
        style={{ marginBottom: "2rem" }}
      >
        <Form.Item label="Total" name={["totalRange"]}>
          <Space>
            <InputNumber min={0} placeholder="Mín" name="min" />
            <InputNumber min={0} placeholder="Máx" name="max" />
          </Space>
        </Form.Item>

        {/* Fecha de inicio */}
        <Form.Item label="Start Date" name="startDate">
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        {/* Fecha de fin */}
        <Form.Item label="End Date" name="endDate">
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <div className="flex flex-row gap-2">
          <Form.Item>
            <Button className="w-22" type="primary" onClick={filterOrders}>
              Filter
            </Button>
          </Form.Item>

          <Form.Item>
            <Button className="w-22" onClick={fetchOrders}>
              Clear
            </Button>
          </Form.Item>
        </div>
      </Form>

      {/* Lista de órdenes */}
      {loading ? (
        <p className="text-gray-500">Cargando órdenes...</p>
      ) : (
        <div className="space-y-4  md:max-h-[68vh] max-h-[55vh] overflow-y-auto p-0 md:w-2/3 md:m-auto md:mt-12">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white shadow-md rounded-lg border border-gray-200 p-4 relative"
            >
              <Tooltip title="Eliminar orden" placement="top">
                <DeleteOutlined
                  onClick={() => handleDelete(order.orderId)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer text-lg"
                />
              </Tooltip>

              <div className="text-sm mb-1">
                <strong>Usuario:</strong> {order.user.name}
              </div>

              <div className="text-sm text-gray-600 mb-2">
                <strong>Fecha:</strong>{" "}
                {new Date(order.createdAt).toLocaleString("es-CO", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </div>

              <div className="text-sm font-semibold text-orange-700 mb-2">
                Total: ${order.total.toLocaleString("es-CO")}
              </div>

              <div className="mb-2">
                <strong className="text-sm text-gray-700 block mb-1">
                  Productos:
                </strong>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                  {order.OrderItem.map((item, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
                    >
                      {item.product.name} × {item.quantity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
