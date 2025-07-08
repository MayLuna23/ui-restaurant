import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  ShoppingOutlined,
  FileTextOutlined,
  PieChartOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const location = useLocation();

  return (
    <Layout style={{  minHeight: '100vh' }}>
      <Sider style={{ background: '#491180'}}>
        <div className="text-white text-center py-6 text-lg font-bold">
          🧾 OceanApp
        </div>
        <Menu
        style={{ background: '#491180'}}
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: '/productos',
              icon: <ShoppingOutlined />,
              label: <Link to="/productos">Productos</Link>,
            },
            {
              key: '/ordenes',
              icon: <FileTextOutlined />,
              label: <Link to="/ordenes">Órdenes</Link>,
            },
            {
              key: '/dashboard',
              icon: <PieChartOutlined />,
              label: <Link to="/dashboard">Dashboard</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#F22FEF', padding: '16px 16px' }}>
          <h1 className="text-xl font-semibold">Gestión de Restaurante</h1>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div className="bg-white p-6 rounded-lg shadow-sm min-h-[80vh]">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;