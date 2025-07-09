import { Form, Input, Button, Select, Row, Col, message, Collapse } from "antd";
import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile"; // Asegúrate de importar tu hook
import { createUser } from "@/api/users";

const { Option } = Select;
const { Panel } = Collapse;

interface FormValues {
  name: string;
  email: string;
  role: string;
  password: string;
}

const UserForm = ({
  onSuccess,
  setShowUsersTable,
  showUsersTable,
  // loading,
  // setLoading
}: {
  onSuccess: (values: FormValues) => void;
  showUsersTable: boolean,
  setShowUsersTable: () => void;
  // setLoading: () => void;
  // loading: boolean,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const isMobile = useIsMobile();

  const onFinish = async (values: FormValues) => {
    try {
      setLoading(true);
      const jwt = localStorage.getItem("jwt") || "";
      const response = await createUser(values, jwt);

      if (response.success) {
        message.success("User created successfully ✅");
        form.resetFields();
        onSuccess?.();
      } else {
        message.error(response.error || "Failed to create user");
      }
    } catch (error) {
      message.error("Error creating user");
      console.error(`❌ ${error} `);
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <Form
      layout="vertical"
      onFinish={onFinish}
      form={form}
      className="max-w-4xl flex flex-col gap-4 m-auto"
    >
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label={
            <span style={{ color: "var(--color-brown-light)" }}>
              Name
            </span>}
            name="name"
            rules={[
              { required: true, message: "Please enter a name" },
              { min: 3, message: "Name must be at least 3 characters" },
              { max: 50, message: "Name must be at most 50 characters" },
            ]}
          >
            <Input placeholder="e.g. John Doe" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            label={
            <span style={{ color: "var(--color-brown-light)" }}>
              Email
            </span>}
            name="email"
            rules={[
              { required: true, message: "Please enter an email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="e.g. john@example.com" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            label={
            <span style={{ color: "var(--color-brown-light)" }}>
              Role
            </span>}
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select a role">
              <Option value="admin">Admin</Option>
              <Option value="waiter">Waiter</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            label={
            <span style={{ color: "var(--color-brown-light)" }}>
              Password
            </span>}
            name="password"
            rules={[
              { required: true, message: "Please enter a password" },
              { min: 8, message: "Password must be at least 8 characters" },
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
                message:
                  "Password must contain at least one letter, one number and one special character",
              },
            ]}
          >
            <Input.Password placeholder="Secure password" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button loading={loading} style={{ backgroundColor: "var(--color-orange-dark)" }} type="primary" htmlType="submit" loading={loading}>
          Create User
        </Button>
      </Form.Item>
    </Form>
  );

  return isMobile ? (
    <Collapse onChange={() => setShowUsersTable(!showUsersTable)}>
      <Panel
        
        header="Register New User"
        key="1"
      >
        {formContent}
      </Panel>
    </Collapse>
  ) : (
    formContent
  );
};

export default UserForm;
