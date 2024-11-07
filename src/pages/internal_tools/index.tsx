import React, { useEffect } from "react";
import { Layout, Menu, Result, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { useAuth } from "../AuthContext";

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
  {
    key: "users",
    label: "Users",
  },
];

const InternalIndex: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { login, isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);
  return (
    <SignedIn>
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
          <Header
            style={{ background: colorBgContainer }}
            className="flex justify-end"
          >
            <div>
              <UserButton showName />
            </div>
          </Header>
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
            {role == "user" ? (
              <Result
                status="warning"
                title="Your account doesn't have permissions, please contact admin"
              />
            ) : (
              <Outlet />
            )}
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Wander Social ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </SignedIn>
  );
};

export default InternalIndex;
