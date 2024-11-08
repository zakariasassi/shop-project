import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Table, Spin, Alert, Select, Button, Input , Space , Card , Divider } from "antd";
import { URL } from "../../constants/URL";
import Loading from "../../components/Loading/Loading";

const { Option } = Select;

// Helper functions for API calls
const fetchRoles = async () => {
  const response = await axios.get(URL + "roles" , {
    headers: {
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  }
    
  );
  return response.data;
};

const fetchPermissions = async () => {
  const response = await axios.get(URL + "roles/permission" , {
    headers: {
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

const fetchAdmins = async () => {
  const token = window.localStorage.getItem("token");
  const response = await axios.get(URL + "admin", {
    headers: { authorization: `Bearer ${token}` },
  });

  const rolesResponse = await Promise.all(
    response.data.map((admin) =>
      axios.get(URL + `admin/${admin.id}/roles`, {
        headers: { authorization: `Bearer ${token}` },
      })
    )
  );

  const rolesMap = {};
  response.data.forEach((admin, index) => {
    rolesMap[admin.id] = rolesResponse[index].data;
  });

  return { admins: response.data, adminRoles: rolesMap };
};

const fetchRolesAndPermissions = async () => {
  const response = await axios.get(URL + "roles/getAllRolesAndPermissions" , {
    headers: {
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

const fetchRolePermissions = async (roleId) => {
  const response = await axios.get(URL + `roles/${roleId}/permission` , {
    headers: {
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

function RolesAndAdmins() {
  const queryClient = useQueryClient();

  const [newRole, setNewRole] = useState("");
  const [newPermission, setNewPermission] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [rolePermissions, setRolePermissions] = useState({});
  const [selectedAdminRoles, setSelectedAdminRoles] = useState({});
  const [selectedRolesForAdmin, setSelectedRolesForAdmin] = useState({});
  const [selectedPermission, setSelectedPermission] = useState("");

  // Fetch roles
  const {
    data: roles,
    isLoading: rolesLoading,
    error: rolesError,
  } = useQuery("roles", fetchRoles);

  // Fetch permissions
  const {
    data: permissions,
    isLoading: permissionsLoading,
    error: permissionsError,
  } = useQuery("permissions", fetchPermissions);

  // Fetch admins and their roles
  const {
    data: adminsData,
    isLoading: adminsLoading,
    error: adminsError,
  } = useQuery("admins", fetchAdmins);

  // Fetch roles and permissions for the table
  const {
    data: rolesPermissionsData,
    isLoading: rolesPermissionsLoading,
    error: rolesPermissionsError,
  } = useQuery("rolesPermissions", fetchRolesAndPermissions);

  // Mutation to add a new role
  const addRoleMutation = useMutation(
    (newRoleName) => axios.post(URL + "roles", { role_name: newRoleName }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("roles");
        queryClient.invalidateQueries("rolesPermissions");
        setNewRole("");
      },
    }
  );

  // Mutation to add a new permission
  const addPermissionMutation = useMutation(
    (newPermissionName) =>
      axios.post(URL + "roles/permission", { permission_name: newPermissionName }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("permissions");
        queryClient.invalidateQueries("rolesPermissions");
        setNewPermission("");
      },
    }
  );

  // Mutation to assign permission to a role
  const assignPermissionMutation = useMutation(
    ({ roleId, permissionId }) =>
      axios.post(URL + `roles/${roleId}/permission`, { permissionId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("rolesPermissions");
        loadRolePermissions(roleId);
        setSelectedPermission("");
      },
    }
  );

  // Mutation to remove permission from a role
  const removePermissionMutation = useMutation(
    ({ roleId, permissionId }) =>
      axios.delete(URL + `roles/${roleId}/permissions/${permissionId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("rolesPermissions");
        loadRolePermissions(roleId);
      },
    }
  );

  // Mutation to delete a role
  const deleteRoleMutation = useMutation(
    (roleId) => axios.delete(URL + `roles/${roleId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("roles");
        queryClient.invalidateQueries("rolesPermissions");
      },
    }
  );

  // Mutation to delete a permission
  const deletePermissionMutation = useMutation(
    (permissionId) => axios.delete(URL + `roles/permission/${permissionId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("permissions");
        queryClient.invalidateQueries("rolesPermissions");
      },
    }
  );

  // Mutation to assign role to admin
  const assignRoleToAdminMutation = useMutation(
    ({ adminId, roleId }) => {
      const token = window.localStorage.getItem("token");
      return axios.post(
        URL + `admin/${adminId}/assign-role`,
        { roleId },
        { headers: { authorization: `Bearer ${token}` } }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("admins");
        // setSelectedRolesForAdmin((prev) => ({ ...prev, [adminId]: "" }));
      },
    }
  );

  // Mutation to remove role from admin
  const removeRoleFromAdminMutation = useMutation(
    ({ adminId, roleId }) => {
      const token = window.localStorage.getItem("token");
      return axios.post(
        URL + `admin/${adminId}/remove-role`,
        { roleId },
        { headers: { authorization: `Bearer ${token}` } }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("admins");
      },
    }
  );

  // Function to load permissions for a selected role
  const loadRolePermissions = async (roleId) => {
    const permissions = await fetchRolePermissions(roleId);
    setRolePermissions((prev) => ({ ...prev, [roleId]: permissions }));
  };

  if (
    rolesLoading ||
    permissionsLoading ||
    adminsLoading ||
    rolesPermissionsLoading
  ) {
    return <Loading />;
  }

  if (
    rolesError ||
    permissionsError ||
    adminsError ||
    rolesPermissionsError
  ) {
    return <Alert message="Error fetching data" type="error" />;
  }

  // Formatting data for the table
  const formatData = rolesPermissionsData.map((role) => ({
    key: role.id,
    roleName: role.role_name,
    permissionName:
      role.Permissions.length > 0
        ? role.Permissions.map((perm) => perm.permission_name).join(", ")
        : "No permissions assigned",
  }));

  const columns = [
    {
      title: "Role",
      dataIndex: "roleName",
      key: "roleName",
    },
    {
      title: "Permissions",
      dataIndex: "permissionName",
      key: "permissionName",
    },
  ];

  return (
<div className="max-w-full p-6 mx-auto rounded-lg" dir="rtl">
  <h1 className="mb-2 text-3xl font-bold text-center text-gray-800">
    ادارة صلاحيات الوصول
  </h1>

  {/* Roles and Permissions Table */}
  <div className="p-5 m-5 bg-gray-200">
    <h2 className="mb-4 text-2xl font-bold text-gray-800">جدول الصلاحيات والتخويلات</h2>
    <Table
      dataSource={formatData}
      columns={columns}
      rowKey={(record) => record.key}
      pagination={{ pageSize: 10 }}
    />
  </div>

  {/* Roles Section */}
  <div className="p-5 m-5 bg-gray-200">
    <h2 className="text-2xl font-bold text-gray-800">الصلاحيات</h2>
    <Input
      placeholder="اسم الصلاحية"
      value={newRole}
      onChange={(e) => setNewRole(e.target.value)}
      style={{ marginBottom: "1rem" }}
    />
    <Button
      type="primary"
      onClick={() => addRoleMutation.mutate(newRole)}
      disabled={!newRole}
    >
      اضافة
    </Button>
    <ul className="mt-4">
      {roles.map((role) => (
        <li key={role.id} className="flex flex-col">
          <label className="font-bold">اسم الصلاحية</label>
          <div className="flex justify-between w-full">
            <span className="text-black">{role.role_name}</span>
            <Button
              type="danger"
              onClick={() => deleteRoleMutation.mutate(role.id)}
            >
              مسح
            </Button>
          </div>
        </li>
      ))}
    </ul>
  </div>

  {/* Permission Section */}
  <div className="p-5 m-5 bg-gray-200">
    <h2 className="text-2xl font-bold text-gray-800">التخويلات</h2>
    <Input
      placeholder="التخويل لكل صلاحية"
      value={newPermission}
      onChange={(e) => setNewPermission(e.target.value)}
      style={{ marginBottom: "1rem" }}
    />
    <Button
      type="primary"
      onClick={() => addPermissionMutation.mutate(newPermission)}
      disabled={!newPermission}
    >
      اضافة تخويل
    </Button>
    <ul className="mt-4">
      {permissions.map((permission) => (
        <li key={permission.id} className="flex items-center justify-between">
          <span className="text-black">{permission.permission_name}</span>
          <Button
            type="danger"
            onClick={() => deletePermissionMutation.mutate(permission.id)}
          >
            مسح
          </Button>
        </li>
      ))}
    </ul>
  </div>

  {/* Assign Permissions to Roles */}
  <div className="p-5 m-5 bg-gray-200">
    <h2 className="text-2xl font-bold text-gray-800">تضمين التخويل للصلاحيات</h2>
    <Select
      placeholder="اختر الصلاحية"
      value={selectedRole || undefined}
      onChange={(value) => {
        setSelectedRole(value);
        loadRolePermissions(value);
      }}
      style={{ width: "100%", marginBottom: "1rem" }}
    >
      {roles.map((role) => (
        <Option key={role.id} value={role.id}>
          {role.role_name}
        </Option>
      ))}
    </Select>
    {selectedRole && (
      <>
        <div>
          <ul className="mt-2">
            {rolePermissions[selectedRole]?.map((permission) => (
              <li key={permission.id} className="flex items-center justify-between">
                <span className="text-name">{permission.permission_name}</span>
                <Button
                  type="danger"
                  onClick={() =>
                    removePermissionMutation.mutate({
                      roleId: selectedRole,
                      permissionId: permission.id,
                    })
                  }
                >
                  ازالة
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <Select
            placeholder="اختر التخويل"
            value={selectedPermission || undefined}
            onChange={(value) => setSelectedPermission(value)}
            style={{ width: "100%", marginBottom: "1rem" }}
          >
            {permissions.map((permission) => (
              <Option key={permission.id} value={permission.id}>
                {permission.permission_name}
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            onClick={() =>
              assignPermissionMutation.mutate({
                roleId: selectedRole,
                permissionId: selectedPermission,
              })
            }
            disabled={!selectedPermission}
          >
            اضافة التخويل للصلاحية
          </Button>
        </div>
      </>
    )}
  </div>

  {/* Admins Section */}
  <div className="p-5 m-5 bg-gray-200">
    <h2 className="mb-4 text-2xl font-semibold text-gray-700">المستخدمين</h2>
    <ul className="space-y-4">
      {adminsData.admins.map((admin) => (
        <li key={admin.id} className="flex items-center justify-between p-4 bg-gray-100 rounded-md shadow-sm">
          <div>
            <p className="text-xl font-medium font-bold text-gray-700">{admin.fullName}</p>
            <p className="text-sm text-gray-500">{admin.username}</p>
            <div className="flex flex-col mt-2">
              {adminsData.adminRoles[admin.id]?.map((role) => (
                <span
                  key={role.id}
                  className="flex items-center px-2 py-1 ml-2 text-xl font-bold text-teal-800 bg-teal-100 rounded-md"
                >
                  {role.role_name}
                  <Button
                    type="link"
                    danger
                    onClick={() =>
                      removeRoleFromAdminMutation.mutate({
                        adminId: admin.id,
                        roleId: role.id,
                      })
                    }
                  >
                    X
                  </Button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <Select
              placeholder="اختر الصلاحية"
              value={selectedRolesForAdmin[admin.id] || undefined}
              onChange={(value) =>
                setSelectedRolesForAdmin((prev) => ({
                  ...prev,
                  [admin.id]: value,
                }))
              }
              style={{ width: 200 }}
            >
              {roles.map((role) => (
                <Option key={role.id} value={role.id}>
                  {role.role_name}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              onClick={() =>
                assignRoleToAdminMutation.mutate({
                  adminId: admin.id,
                  roleId: selectedRolesForAdmin[admin.id],
                })
              }
              disabled={!selectedRolesForAdmin[admin.id]}
            >
              اضافة
            </Button>
          </div>
        </li>
      ))}
    </ul>
  </div>
</div>

  );
}

export default RolesAndAdmins;
