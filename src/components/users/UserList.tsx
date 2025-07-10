import { useIsMobile } from "@/hooks/useIsMobile";
import type { User } from "@/types";
import { Table } from "antd";


const UserList = ({
  users,
  loading,
  error,
}: {
  users: User[];
  loading: boolean;
  error: string;
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <main className="h-full overflow-y-auto lg:max-w-5xl m-auto">
        <Table
          className="custom-table"
          rowKey="userId"
          dataSource={users}
          loading={loading}
          pagination={false}
          scroll={{ y: isMobile ? 500 : 400 }}
          columns={[
            {
              title: "Name",
              dataIndex: "name",
            },
            {
              title: "Email",
              dataIndex: "email",
            },
            {
              title: "Role",
              dataIndex: "role",
              render: (role: string) =>
                role.charAt(0).toUpperCase() + role.slice(1),
            },
            {
              title: "Date",
              dataIndex: "createdAt",
              render: (value: string) =>
                new Date(value).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }),
            },
          ]}
        />
      </main>
    </>
  );
};

export default UserList;
