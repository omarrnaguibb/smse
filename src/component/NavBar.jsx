import React from "react";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  if (
    window.location.pathname.includes("navaz")
  )
    return;
  return (
    <div
      className="w-full flex-col flex  justify-between bg-white drop-shadow-lg pt-3 "
      dir="rtl"
    >
      <div className="w-full flex items-center justify-center py-2">
        <img src="/logo.svg" className=" max-w-1/2" onClick={() => navigate("/")} />
      </div>
    </div>
  );
};

export default NavBar;
