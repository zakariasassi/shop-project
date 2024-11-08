import  { useState } from "react";
import { Layout, Menu, Avatar, Typography,  Dropdown } from "antd";
import {

  SettingOutlined,
  PoweroffOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import SideBar from "../components/SideBar/SideBar";
import Wrapper from "./Warper";
import { useAtom } from "jotai";
import { profile } from "../state/userAtom";
import { IMAGE_URL } from "../../../client/src/constant/URL";

const { Header, Content } = Layout;
const { Text } = Typography;

function AppLayout({ render, name }) {
  const [collapsed, setCollapsed] = useState(false);
  const [user] = useAtom(profile);


  const logout = () => {
    window.localStorage.clear();
    window.location.replace('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">الملف الشخصي</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/settings">الاعدادات</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<PoweroffOutlined />} onClick={logout}>
        خروج
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout  dir="rtl" style={{ minHeight: "100vh" }}>
            <SideBar collapsed={collapsed} />

      <Layout className="w-full site-layout">
        <Header className="site-layout-background" style={{ padding: 0, background: "#fff", boxShadow: "0 1px 4px rgba(0,21,41,.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%"}}>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* <Badge count={5} style={{ marginRight: 24 }}>
                <BellOutlined style={{ fontSize: 20 }} />
              </Badge> */}
              <Dropdown overlay={userMenu} trigger={['click']}>
                <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <Avatar src={IMAGE_URL + "adminimage/" + user?.image} style={{ marginRight: 8 }} />
                  <Text strong>{user?.name}</Text>
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content className="w-full" dir="rtl" style={{ margin: "24px 16px 0", overflow: "initial", padding: "24px", minHeight: 280 }}>
          <Wrapper  page={render} pagename={name} />
        </Content>
      </Layout>

    </Layout>
  );
}

export default AppLayout;