import React, { useState } from "react";
import {
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import Logo from "@/components/AppLogo";

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const [isMobile, setIsMobile] = useState(false);
  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        style={{ backgroundColor: "var(--color-orange-dark)"}}
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={isMobile ? 0 : 80}
        breakpoint="md"
        onBreakpoint={(broken) => setIsMobile(broken)}
      >
        <div
          className="demo-logo-vertical"
          style={{
            height: 64,
            margin: 16,
            background: "rgba(255, 255, 255, 0.3)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 18,
            transition: "all 0.3s ease",
          }}
        >
          {collapsed ? "🍔" : "Ocean Restaurant"}
        </div>

        <Menu
          className="custom-menu"
          style={{ backgroundColor: "var(--color-orange-dark)" }}
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "/productos",
              icon: <ShoppingOutlined style={{ fontSize: "1.4rem" }} />,
              label: <Link to="/products">Productos</Link>,
            },
            {
              key: "/ordenes",
              icon: <FileTextOutlined style={{ fontSize: "1.4rem" }} />,
              label: <Link to="/orders">Create Order</Link>,
            },
            {
              key: "/dashboard",
              icon: <PieChartOutlined style={{ fontSize: "1.4rem" }} />,
              label: <Link to="/dashboard">Dashboard</Link>,
            },
            {
              key: "/users",
              icon: <PersonAddAltIcon style={{ fontSize: "1.5rem" }} />,
              label: <Link to="/users">Add User</Link>,
            },
            {
              key: "/logout",
              icon: <LogoutIcon style={{ fontSize: "1.6rem" }} />,
              label: <Link to="/dashboard">Log Out</Link>,
            },
          ]}
        />
      </Sider>
      <Layout className="bg-orange-gradient">
        <Header
          className="bg-orange-gradient relative flex items-center justify-center"
          style={{ padding: 0, height: 100 }}
        >
          {/* Botón fijo a la izquierda */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 100,
              position: "absolute",
              left: 0,
              top: 0,
            }}
          />

          {/* Logo centrado */}
          <div className="flex items-center justify-center">
            <Logo />
          </div>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            // background: "var(--color-peach-light)",
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
