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
  Input,
  Select,
} from "antd";
import dayjs from "dayjs";
import { CustomNotification } from "./Notification";
import { useAuth } from "@/context/AuthContext";
import { deleteOrder, fetchOrdersReq, filterOrdersReq } from "@/api/orders";
import { fetchUsersReq } from "@/api/users";
import SyncLoader from "react-spinners/SyncLoader";
const { Option } = Select;

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

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();
  const { isAdmin, userName } = useAuth();

  const fetchOrders = async () => {
    setLoading(true);
    form.resetFields();
    try {
      const token = localStorage.getItem("jwt") || "";
      const res = await fetchOrdersReq(token, isAdmin);
      const resUsers = await fetchUsersReq(token);
      setUsers(resUsers.data.data);
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
      bodyUserId,
    } = form.getFieldsValue();
    const payload: any = {};

    if (totalRange.min != null) payload.minTotal = totalRange.min;
    if (totalRange.max != null) payload.maxTotal = totalRange.max;
    if (startDate) payload.startDate = dayjs(startDate).format("YYYY-MM-DD");
    if (endDate) payload.endDate = dayjs(endDate).format("YYYY-MM-DD");
    if (bodyUserId) payload.bodyUserId = bodyUserId;

    // 🔴 Validaciones
    if (
      (payload.minTotal && !payload.maxTotal) ||
      (!payload.minTotal && payload.maxTotal)
    ) {
      message.error("Please select the minimum and maximum total");
      return;
    }

    if (payload.minTotal != null && payload.maxTotal != null) {
      if (payload.minTotal > payload.maxTotal) {
        message.error("Minimum total cannot be greater than maximum total.");
        return;
      }
    }

    if (startDate && endDate) {
      if (dayjs(startDate).isAfter(dayjs(endDate))) {
        message.error("Start date cannot be after End date.");
        return;
      }
    }

    if ((startDate && !endDate) || (!startDate && endDate)) {
      message.error("Please select both dates");
      return;
    }

    if (Object.keys(payload).length === 0) {
      message.error("Please select at least one filter.");
      return;
    }

    setLoading(true);
    try {
      const jwt = localStorage.getItem("jwt") || "";
      const res = await filterOrdersReq(payload, jwt);
      if (res.data.data.length === 0) {
        message.info("No orders found for the selected filters.");
      }
      setOrders(res.data.data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Error filtering orders";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (orderId: number, total: number, date: string) => {
    const jwt = localStorage.getItem("jwt") || "";
    Modal.confirm({
      title: "¿Estás seguro de eliminar esta orden?",
      content: (
        <div>
          <span className="font-bold">Total:</span> $
          {total.toLocaleString("es-CO")}{" "}
          <span className="font-bold">Date:</span>{" "}
          {new Date(date).toLocaleString("es-CO", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </div>
      ),
      okText: "Eliminar",
      cancelText: "Cancelar",
      okType: "danger",
      centered: true,
      onOk: async () => {
        try {
          const req = await deleteOrder(orderId, jwt);
          if (req.success) {
            CustomNotification({
              type: "success",
              message: "Orden eliminada correctamente",
            });
            fetchOrders(); // Refrescar la lista de órdenes
          } else {
            CustomNotification({
              type: "error",
              message: req.error || "Error al eliminar la orden",
            });
          }
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
        <Form.Item label="Total">
          <Space>
            <Form.Item name={["totalRange", "min"]} noStyle>
              <InputNumber min={0} placeholder="Min" />
            </Form.Item>
            <Form.Item name={["totalRange", "max"]} noStyle>
              <InputNumber min={0} placeholder="Max" />
            </Form.Item>
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

        {isAdmin && (
          <Form.Item label="" name="bodyUserId">
            <Select
              name="user"
              placeholder="Users"
              // onChange={handleSelect}
              showSearch
              filterOption={(input, option) =>
                option?.children
                  ?.toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {users.map((user) => (
                <Option key={user.userId} value={user.userId}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* <Form.Item
          name="user"
          rules={[
            { type: "string", message: "The email format is invalid" },
          ]}
        >
          <Input placeholder="User" />
        </Form.Item> */}

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

      <div className="text-center mb-8">
        {isAdmin ? (
          <span>Here you can view and filter all users' orders.</span>
        ) : (
          <span>
            {userName}, Here you can see and filter all orders in your name.
          </span>
        )}
      </div>

      {/* Lista de órdenes */}
      {loading ? (
        <div className="min-h-[40vh] flex justify-center items-center" ><SyncLoader color="#c16135" /></div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">No orders found.</p>
      ) : (
        <div className="space-y-4 md:max-h-[68vh] max-h-[55vh] overflow-y-auto p-0 md:w-2/3 md:m-auto md:mt-12">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white shadow-md rounded-lg border border-gray-200 p-4 relative"
            >
              <Tooltip title="Delete order" placement="top">
                {isAdmin && (
                  <DeleteOutlined
                    onClick={() =>
                      handleDelete(order.orderId, order.total, order.createdAt)
                    }
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer text-lg"
                  />
                )}
              </Tooltip>

              <div className="text-sm mb-1">
                <strong>User:</strong> {order.user.name}
              </div>

              <div className="text-sm text-gray-600 mb-2">
                <strong>Date:</strong>{" "}
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
                  Products:
                </strong>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                  {order.OrderItem.map((item, index) => (
                    <span
                      key={index}
                      style={{backgroundColor: "var(--color-peach-light)"}}
                      className="color-orange-dark color-orange-light text-xs font-medium px-2 py-1 rounded"
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
