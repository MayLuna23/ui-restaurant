import { Form, Input, Typography, message, Card } from "antd";
import CustomButton from "@/components/CustomButton";
import axios from "axios";
import Logo from "@/components/AppLogo";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const res = await login(values.email, values.password);
      if (res) {
        form.resetFields();
        message.success("Login successful");
        navigate("/dashboard");
      } else {
        message.error("Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Error during login";
      message.error(msg);
    }
  };

  return (
    <div className="bg-orange-gradient min-h-screen flex flex-col items-center">
      {/* Título arriba */}
      <div className="py-8">
        <Logo size="6rem" />
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
              <CustomButton isPrimary={true} label="Log In" />
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
