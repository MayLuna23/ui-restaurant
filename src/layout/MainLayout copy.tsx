import React, { useState, useEffect } from "react";
import {
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Modal, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import Logo from "@/components/AppLogo";
import { useAuth } from "@/context/AuthContext";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Tooltip } from "antd";
import { useIsMobile } from "@/hooks/useIsMobile";

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { isAdmin, logout, userName } = useAuth();
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const formatUserName = (name: string) => {
    const firstWord = name.split(" ")[0];
    return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
  };

  return (
    <Layout style={{ height: "100vh" }}>
      {isMobile && !collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 999,
          }}
        />
      )}
      <Sider
        style={{
          backgroundColor: "var(--color-orange-dark)",
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
        }}
        width={200}
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={isMobile ? 0 : 80}
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
            cursor: "pointer",
          }}
        >
          {collapsed ? (
            <Tooltip
              title={`${formatUserName(userName)} (${
                isAdmin ? "Admin" : "Waiter"
              })`}
              placement="right"
            >
              <AccountCircleIcon />
            </Tooltip>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span>{formatUserName(userName)}</span>
              <span>{isAdmin ? "Admin" : "Waiter"}</span>
            </div>
          )}
        </div>

        <Menu
          className="custom-menu"
          style={{ backgroundColor: "var(--color-orange-dark)" }}
          mode="inline"
          selectedKeys={[]}
          onClick={({ key }) => {
            if (key === "logout") {
              Modal.confirm({
                title: "Are you sure you want to log out?",
                okText: "Log Out",
                cancelText: "Cancel",
                okType: "danger",
                centered: true,
                onOk: () => {
                  logout();
                  navigate("/login");
                },
              });
              return;
            }

            navigate(key);
          }}
          items={[
            {
              key: "/dashboard",
              icon: <PieChartOutlined style={{ fontSize: "1.4rem" }} />,
              label: <Link to="/dashboard">Dashboard</Link>,
            },
            {
              key: "/orders",
              icon: <FileTextOutlined style={{ fontSize: "1.4rem" }} />,
              label: <Link to="/orders">Create Order</Link>,
            },
            {
              key: "/products",
              icon: <ShoppingOutlined style={{ fontSize: "1.4rem" }} />,
              label: <Link to="/products">Products</Link>,
            },
            ...(isAdmin
              ? [
                  {
                    key: "/users",
                    icon: <PersonAddAltIcon style={{ fontSize: "1.5rem" }} />,
                    label: <Link to="/users">Add User</Link>,
                  },
                ]
              : []),
            {
              key: "logout",
              icon: <LogoutIcon style={{ fontSize: "1.6rem" }} />,
              label: "Log Out",
            },
          ]}
        />
      </Sider>
      <Layout
        className="bg-orange-gradient"
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 200,
          // marginLeft: collapsed ? (isMobile ? 0 : 80) : 200,
          transition: "margin-left 0.3s",
        }}
      >
        <Header
          className="bg-orange-gradient relative flex items-center justify-center"
          style={{ padding: 0, height: 100 }}
        >
          {/* Botón fijo a la izquierda */}
          {<Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              color: "var(--color-brown-light)",
              fontSize: "16px",
              width: 64,
              height: 100,
              position: "absolute",
              left: 0,
              top: 0,
             marginLeft: isMobile ? 0 : collapsed ? 0 : 0,

              transition: "margin-left 0.3s",
            }}
          />}

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
