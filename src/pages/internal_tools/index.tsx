import React from "react";
import { Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import PrivateRoute from "./PrivateRoute";

const { Header, Content, Footer, Sider } = Layout;

const items = [
  {
    key: "express",
    label: "Question",
  },
  {
    key: "dailyExpress",
    label: "Daily Question",
  },
  {
    key: "expression",
    label: "Answers",
  },
  {
    key: "colleges",
    label: "Colleges",
  },
];

const InternalIndex: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <PrivateRoute>
      <Layout className="h-screen">
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="demo-logo-vertical">
            <img src={logo} alt="" className="w-20 m-auto my-4" />
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={pathname.split("/")}
            selectedKeys={pathname.split("/")}
            items={items}
            onClick={(item) => {
              navigate(`/internal/${item.key}`);
            }}
          />
        </Sider>
        <Layout>
          {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
          <Content
            style={{
              margin: "24px 16px 0",
              maxWidth: "100%",
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
            className="overflow-y-scroll"
          >
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Wander Social ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </PrivateRoute>
  );
};

export default InternalIndex;
