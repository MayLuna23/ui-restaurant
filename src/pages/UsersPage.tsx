import { useEffect, useState } from "react";
import UserForm from "@/components/users/UserForm";
import { fetchUsersReq } from "@/api/users";
import UserList from "@/components/users/UserList";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import type { User } from "@/types";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMssg, setErrorMssg] = useState("");
  const [showUsersTable, setShowUsersTable] = useState(true);
  useDocumentTitle("Users | Ocean App");
  
  const getUsers = async () => {
    setLoading(true);
    try {
      const jwt = localStorage.getItem("jwt") || "";
      const res = await fetchUsersReq(jwt);
      console.log(res);
      res.success ? setUsers(res.data?.data || []) : setUsers([]);
    } catch (err) {
      setErrorMssg("Error al obtener productos");
      console.error("Error al obtener productos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 color-brown-light text-center">
        Users
      </h2>
      <UserForm
        onSuccess={getUsers}
        setShowUsersTable={setShowUsersTable}
        showUsersTable={showUsersTable}
      />

      <div className="mt-10">
        {showUsersTable && (
          <UserList users={users} loading={loading} error={errorMssg} />
        )}
      </div>
    </div>
  );
};

export default UsersPage;
