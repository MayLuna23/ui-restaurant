// src/pages/UsersPage.tsx

import { useEffect, useState } from "react";
import UserForm from "@/components/UserForm";
// import UserList from "../components/UserList";
import { fetchUsersReq } from "@/api/users";
import UserList from "@/components/UserList";

type User = {
  name: string;
  email: string;
  role: string;
  password: string;
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMssg, setErrorMssg] = useState("");

  const getUsers = async () => {
    // await Promise.resolve(); // Simulate a delay for loading state
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
      <h2 className="text-2xl font-semibold mb-6">Users</h2>
        <UserForm onSuccess={getUsers} />

        <div className="mt-10">
          <UserList users={users} loading={loading} error={errorMssg} />
        </div>
    </div>
  );
};

export default UsersPage;
