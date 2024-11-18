import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, Avatar, Typography, Button } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  TagsOutlined,
  TruckOutlined,
  BarChartOutlined,
  DollarOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useAtom } from "jotai";
import { profile } from "../../state/userAtom";
import { permissionsAtom, rolesAtom } from "../../state/rolesAtom";
import { IMAGE_URL } from "../../../../client/src/constant/URL";

const { Sider } = Layout;
const { Title, Text } = Typography;

function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const [user] = useAtom(profile);
  const [roles] = useAtom(rolesAtom);
  const [permissions] = useAtom(permissionsAtom);
  const location = useLocation();

  const hasRole = (roleName) =>
    roles.some((role) => role.role_name === roleName);
  const hasPermission = (permissionName) =>
    permissions.includes(permissionName);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider
      width={250}
      collapsible
      collapsed={collapsed}
      onCollapse={toggleSidebar}
      className="site-layout-background"
      theme="light"
      dir="rtl"
    >
      <div className="logo" style={{ padding: "16px", textAlign: "center" }}>
        <Avatar
          size={collapsed ? 64 : 80}
          src={IMAGE_URL + "adminimage/" + user?.image}
          alt="User"
        />
        {!collapsed && (
          <div style={{ marginTop: 10 }}>
            <Title level={4}>{user?.name}</Title>
            <Text type="secondary">
              {hasPermission("مدير") ? "مدير النظام" : "مستخدم"}
            </Text>
          </div>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ height: "100%", borderRight: 0 }}
      >
        <Menu.Item key="/" icon={<DashboardOutlined />}>
          <Link to="/">الرئيسية</Link>
        </Menu.Item>

        {hasRole("suber user") && (
          <Menu.SubMenu key="sub1" icon={<UserOutlined />} title="المستخدمين">
            <Menu.Item key="/create-user">
              <Link to="/create-user">ادارة المستخدمين</Link>
            </Menu.Item>
            <Menu.Item key="/roles">
              <Link to="/roles">الصلاحيات</Link>
            </Menu.Item>
          </Menu.SubMenu>
        )}

        {hasRole("suber user") && (
          <Menu.SubMenu key="sub2" icon={<TagsOutlined />} title="التصنيفات">
            <Menu.Item key="/main-categorys">
              <Link to="/main-categorys">التصنيفات الرئيسية</Link>
            </Menu.Item>
            <Menu.Item key="/sub-categorys">
              <Link to="/sub-categorys">التصنيفات الفرعية</Link>
            </Menu.Item>
            <Menu.Item key="/brands-categorys">
              <Link to="/brands-categorys">العلامات التجارية</Link>
            </Menu.Item>
          </Menu.SubMenu>
        )}

        {(hasRole("suber user") ||
          hasRole("items inserter one") ||
          hasRole("items pricier")) && (
          <Menu.SubMenu key="sub3" icon={<ShoppingOutlined />} title="المنتجات">
            {(hasRole("suber user") || hasRole("items inserter one")) && (
              <Menu.Item key="/create-product">
                <Link to="/create-product">اضافة منتج</Link>
              </Menu.Item>
            )}

            {(hasRole("suber user") ||  hasRole("items inserter one") || hasRole("items pricier")) && (
              <Menu.Item key="/manage-products">
                <Link to="/manage-products">ادارة المنتجات</Link>
              </Menu.Item>
            )}
          </Menu.SubMenu>
        )}

        {(hasRole("suber user") || hasRole("customer service one") || hasRole('customer service tow') ) && (
          <Menu.SubMenu key="sub4" icon={<TruckOutlined />} title="الطلبيات">
            <Menu.Item key="/manage-orders">
              <Link to="/manage-orders">ادارة الطلبيات</Link>
            </Menu.Item>
          </Menu.SubMenu>
        )}

        {(hasPermission("ادارة الاعلانات") && hasPermission("ادارة العروض")) ||
        hasRole("suber user") ? (
          <Menu.SubMenu key="sub5" icon={<TagsOutlined />} title="العروض">
            <Menu.Item key="/manage-adds">
              <Link to="/manage-adds">ادارة الاعلانات</Link>
            </Menu.Item>
            <Menu.Item key="/manage-offers">
              <Link to="/manage-offers">ادارة العروض</Link>
            </Menu.Item>
          </Menu.SubMenu>
        ) : null}

        {hasRole("suber user") && (
          <Menu.SubMenu key="sub6" icon={<DashboardOutlined />} title="التسويق">
            <Menu.Item key="/coupons">
              <Link to="/coupons">اكواد الخصم</Link>
            </Menu.Item>
            {/* <Menu.Item key="/loyalty-points">
              <Link to="/loyalty-points">نقاط الولاء</Link>
            </Menu.Item> */}
          </Menu.SubMenu>
        )}

        {hasPermission("create-cards") || hasRole("suber user") ? (
          <Menu.SubMenu key="sub7" icon={<DollarOutlined />} title="الدفع">
            <Menu.Item key="/create-cards">
              <Link to="/create-cards">توليد الكروت</Link>
            </Menu.Item>
            <Menu.Item key="/manage-cards">
              <Link to="/manage-cards">ادارة الكروت</Link>
            </Menu.Item>
            {/* <Menu.Item key="/canseled-cards">
              <Link to="/canseled-cards">الكروت الملغية</Link>
            </Menu.Item> */}
          </Menu.SubMenu>
        ) : null}

        {hasRole("customer accounts") || hasRole("suber user") ? (
          <Menu.SubMenu key="sub8" icon={<UserOutlined />} title="العملاء">
            <Menu.Item key="/manage-cutomers">
              <Link to="/manage-cutomers">ادارة العملاء</Link>
            </Menu.Item>
          </Menu.SubMenu>
        ) : null}

        {hasPermission("reports") || hasRole("suber user") ? (
          <Menu.SubMenu key="sub9" icon={<BarChartOutlined />} title="التقارير">
            <Menu.Item key="/reports/vesting">
              <Link to="/reports/vesting">تقرير الزيارات </Link>
            </Menu.Item>
            <Menu.Item key="/reports/sales">
              <Link to="/reports/sales">المبيعات</Link>
            </Menu.Item>
            <Menu.Item key="/reports/top-sold-products">
              <Link to="/reports/top-sold-products">المنتجات الاكثر مبيعا</Link>
            </Menu.Item>
            <Menu.Item key="/reports/orders">
              <Link to="/reports/orders"> الطلبيات </Link>
            </Menu.Item>
            <Menu.Item key="/reports/most-products-vist">
              <Link to="/reports/most-products-vist"> المنتجات الاكثر زيارة</Link>
            </Menu.Item>
            <Menu.Item key="/reports/sold-products">
              <Link to="/reports/sold-products"> المنتجات المباعة </Link>
            </Menu.Item>
            <Menu.Item key="/reports/sold-product-amount">
              <Link to="/reports/sold-product-amount"> عدد مبيعات المنتجات </Link>
            </Menu.Item>
            <Menu.Item key="/reports/cart-drop-percentage">
              <Link to="/reports/cart-drop-percentage"> معدل التخلي عن عربة التسوق</Link>
            </Menu.Item>
          </Menu.SubMenu>
        ) : null}
      </Menu>


    </Sider>
  );
}

export default SideBar;
