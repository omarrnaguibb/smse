import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const PaymentSymmry = () => {
  const query = new URLSearchParams(window.location.search);
  const data = query.get("data");
  const [method, setMethod] = useState("");
   const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem("method", method);
    return navigate("/payment-form?data=" + data);
  };
  return (
    <div
      className="w-full flex flex-col justify-start items-center  py-2 min-h-screen md:w-2/3 lg:w-1/3 "
      dir="rtl"
    >
      <div className="  md:w-10/12 w-11/12 flex flex-col  gap-y-5  mt-10 p-3 rounded-md border">
        <div className="flex">
          <span className="text-xl text-sky-600 font-bold">تفاصيل السعر</span>
          <img src="/logo.svg" className="w-3/4" />
        </div>
        <div className="md:w-11/12 w-full  rounded-lg bg-white flex flex-col items-start justify-start ">
          <div className="w-full   flex   px-3">
            <span className="text-sky-600 text-base font-bold  w-full">
              رسوم تقديم الطلب
            </span>
            <span className=" text-sky-600 px-2 py-1 w-fit text-base font-bold">
              10.00
            </span>
          </div>
          <div className="w-full   flex   px-3">
            <span className="text-green-600  text-base font-bold   w-full">
              رسوم الفحص الدوري
            </span>
            <span className=" text-green-600 px-2 py-1 w-fit text-base font-bold">
              105.00
            </span>
          </div>
          <div className="w-full   flex bg-gray-100   p-3">
            <span className="text-sky-700 text-xl font-bold  w-full">
              المجموع
            </span>
            <span className=" text-orange-400 px-2 py-1 w-fit text-xl font-bold">
              115.00
            </span>
          </div>
        </div>
      </div>

      <form
        className="flex flex-col w-full justify-center items-center mt-5 gap-y-5"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="mada"
          className="w-11/12 flex justify-between p-4 border rounded-md"
          onClick={() => setMethod("mada")}
        >
          <div className="flex items-center gap-x-2">
            <input type="radio" name="method" id="mada" />
            <span className="text-gray-700 text-xl font-bold">مدى</span>
          </div>
          <img
            src="data:image/png;base64,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"
            className="w-20"
          />
        </label>
        <label
          htmlFor="master"
          className="w-11/12 flex justify-between p-4 border rounded-md"
          onClick={() => setMethod("visa&master")}
        >
          <div className="flex items-center gap-x-2">
            <input type="radio" name="method" id="master" />
            <span className="text-gray-700 text-xl font-bold">
              فيزا , ماستر كارد
            </span>
          </div>
          <img
            src="https://banner2.cleanpng.com/20180717/aer/455fe462ca5fa5378d531a29f5365fb6.webp"
            className="w-20"
          />
        </label>
        <label
          htmlFor="apple"
          className="w-11/12 flex justify-between p-4 border rounded-md"
          onClick={() => setMethod("apple")}
        >
          <div className="flex items-center gap-x-2">
            <input type="radio" name="method" id="apple" />
            <span className="text-gray-700 text-xl font-bold">أبل باي</span>
          </div>
          <img
            src="https://1000logos.net/wp-content/uploads/2023/03/Apple-Pay-logo.png"
            className="w-16"
          />
        </label>
        {method === "apple" ? (
          <p className="w-11/12 flex justify-between p-4 border rounded-md text-red-500 text-sm bg-[#f8d7da]">
            عذراً خدمة الدفع عبر أبل باي متوقفة مؤقتاً يمكنك التمتع بتجربة دفع
            سلسة وآمنة عبر بطاقات الدفع.
          </p>
        ) : (
          ""
        )}

        <div className="w-full flex items-center justify-center ">
          <button
            className="text-white hover:opacity-90 rounded-sm w-11/12 bg-orange-400 py-3 px-2 text-xl "
            type="submit"
            disabled={method == "apple" || method == ""}
          >
            إتمام الدفع
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentSymmry;
