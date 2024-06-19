import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";

const Layout = () => {
  const navigate = useNavigate();
  const users = useSelector((state) => state.login.userLogin);

  useEffect(() => {
    if (!users) {
      navigate("/login");
    }else{
      navigate("/")
    }
  }, []);


  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Layout;
