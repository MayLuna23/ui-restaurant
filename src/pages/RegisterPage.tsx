import {
  Form,
  Input,
  Select,
  Button,
  Typography,
  message,
  Card,
} from 'antd';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const RegisterPage = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      await axios.post('http://localhost:3000/api/users', values);
      message.success('Usuario registrado con éxito 🎉');
      form.resetFields();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Error al registrar usuario';
      message.error(msg);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <Title level={3}>Registro de Usuario 👤</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Nombre"
            name="name"
            rules={[
              { required: true, message: 'El nombre es obligatorio' },
              { min: 3, message: 'Mínimo 3 caracteres' },
            ]}
          >
            <Input placeholder="Ej: Ana López" />
          </Form.Item>

          <Form.Item
            label="Correo"
            name="email"
            rules={[
              { required: true, message: 'El email es obligatorio' },
              { type: 'email', message: 'Email no válido' },
            ]}
          >
            <Input placeholder="Ej: ana@email.com" />
          </Form.Item>

          <Form.Item
            label="Rol"
            name="role"
            rules={[{ required: true, message: 'Selecciona un rol' }]}
          >
            <Select placeholder="Selecciona un rol">
              <Option value="admin">Administrador</Option>
              <Option value="waiter">Mesero</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              { required: true, message: 'La contraseña es obligatoria' },
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
                message:
                  'Debe tener una letra, un número y un caracter especial',
              },
              { min: 8, message: 'Mínimo 8 caracteres' },
              { max: 20, message: 'Máximo 20 caracteres' },
            ]}
          >
            <Input.Password placeholder="Contraseña segura" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Registrarse
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
