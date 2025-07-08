import { Form, Input, Typography, message, Card } from "antd";
import CustomButton from "@/components/CustomButton";
import axios from "axios";

const { Title } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        values
      );
      const token = res.data?.token;

      if (token) {
        localStorage.setItem("token", token);
        message.success("Inicio de sesión exitoso 🎉");
        // window.location.href = "/dashboard";
      } else {
        message.error("Respuesta inválida del servidor");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Error al iniciar sesión";
      message.error(msg);
    }
  };

  return (
    <div className="bg-orange-gradient min-h-screen flex flex-col items-center">
      {/* Título arriba */}
      <div className="py-8">
        <h1 className="text-3xl font-bold text-orangeDark">Ocean Restaurant</h1>
      </div>

      {/* Formulario centrado en el espacio restante */}
      <div className="flex-1 flex items-center justify-center w-full px-4">
        <Card className="w-full max-w-md border-0 rounded-xl bg-transparent">
          <Title
            style={{ color: "var(--color-orange-dark)" }}
            level={2}
            className="text-center color-orange-dark"
          >
            Log In
          </Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "The email is required" },
                { type: "email", message: "The email format is invalid" },
              ]}
            >
              <Input placeholder="example@email.com" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "La contraseña es obligatoria" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item className="text-center">
              <CustomButton isPrimary={true} label="Log In"  />
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
