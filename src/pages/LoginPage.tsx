import { Form, Input, Typography, message, Card, Button } from "antd";
import Logo from "@/components/AppLogo";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { useState } from "react";

const { Title } = Typography;

const LoginPage = () => {
  useDocumentTitle("Ocean App");
  const [form] = Form.useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 5000));

    try {
      const res = await login(values.email, values.password);
      if (res) {
        navigate("/dashboard");
        message.success("Login successful");
        form.resetFields();
      } else {
        message.error("Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Error during login";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-orange-gradient min-h-screen flex flex-col items-center">
      <div className="py-8 pt-24">
        <Logo size="6rem" />
      </div>

      <div className="flex-1 flex  justify-center w-full px-4 pt-12">
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
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item style={{ marginTop: "46px" }} className="text-center">
              {/* <CustomButton isPrimary={true} label="Log In" /> */}
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  backgroundColor: "var(--color-orange-dark)",
                  width: "250px",
                  height: "50px",
                  fontSize: "20px",
                  color: "white",
                }}
              >
                Log In
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
