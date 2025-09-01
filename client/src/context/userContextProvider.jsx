import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { logout } from "@/utils/utility";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(); // Example state
  async function login() {
    const res = await axios.get("http://localhost:5000/api/user", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (res.status === 200) {
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
    } else if (res.status === 401 || res.status === 403) {
      logout();
      setUser(null);
    }
  }

  useEffect(() => {

    login();
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
