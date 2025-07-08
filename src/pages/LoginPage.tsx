import {
  Form,
  Input,
  Button,
  Typography,
  message,
  Card,
} from 'antd';
import axios from 'axios';

const { Title } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', values);
      const token = res.data?.token;

      if (token) {
        localStorage.setItem('token', token);
        message.success('Inicio de sesión exitoso 🎉');
        // Aquí puedes redirigir al dashboard o la home
        // Por ejemplo: window.location.href = '/dashboard';
      } else {
        message.error('Respuesta inválida del servidor');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Error al iniciar sesión';
      message.error(msg);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <Title level={3}>Iniciar Sesión 🔐</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Correo"
            name="email"
            rules={[
              { required: true, message: 'El email es obligatorio' },
              { type: 'email', message: 'Formato de email inválido' },
            ]}
          >
            <Input placeholder="Ej: juan@email.com" />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'La contraseña es obligatoria' }]}
          >
            <Input.Password placeholder="Contraseña" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
