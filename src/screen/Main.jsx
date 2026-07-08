import React from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

export const serverRoute = "http://localhost:8080";
// export const serverRoute = "https://test-sism-production.up.railway.app";
export const socket = io(serverRoute);

const Main = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col bg-white h-full relative">
      {/* Hero Section */}
      <div className="relative grid place-items-center py-4 lg:py-24 px-2 bg-gray-50">
        <div className="lg:flex items-center gap-20 max-w-7xl mx-auto relative">
          <div className="relative z-10 flex flex-col items-center grow text-center">
            <p className="text-green-600 font-bold">
              أحد منتجات مركز سلامة المركبات
            </p>
            <h2 className="font-bold  text-2xl text-black mt-2 w-4/5">
              المنصة الموحدة لمواعيد الفحص الفني الدوري للمركبات
            </h2>
            <p className="leading-relaxed text-gray-500/85 max-w-md mt-4 font-bold">
              تتيح المنصة حجز وإدارة مواعيد الفحص الفني الدوري للمركبات لدى جميع
              الجهات المرخصة من المواصفات السعودية لتقديم الخدمة
            </p>
            <div className="max-w-[600px] my-12">
              <img
                src="/bg.png"
                alt="hero image"
                className="w-full h-auto p-2"
              />
            </div>
            <p className="leading-relaxed text-gray-500/85 max-w-md mt-4 font-semibold">
              يمكنك حجز موعد جديد أو تعديل أو إلغاء موعدك
            </p>
            <div className="flex gap-4 mt-6 flex-col sm:flex-row">
              <button
                onClick={() => {
                  sessionStorage.setItem("session", Date.now());
                  navigate("/new-date");
                }}
                className="bg-green-700 hover:bg-green-800 text-white px-10 py-3 rounded-full font-medium transition-colors"
              >
                حجز موعد
              </button>
              <button
                onClick={() => {
                  sessionStorage.setItem("session", Date.now());
                  navigate("/new-date");
                }}
                className="border-2 border-green-700 text-green-700 hover:bg-green-50 px-10 py-3 rounded-full font-medium transition-colors"
              >
                تعديل موعد
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* When to Inspect Section */}
      <div className="w-full bg-gray-50 py-10 px-4 flex items-center justify-center">
        <div className="max-w-6xl mx-auto flex flex-col">
          <h2 className="text-xl lg:text-center lg:text-3xl font-bold mb-8">
            متى يجب فحص المركبة
          </h2>
          <div className="flex gap-4 flex-col lg:flex-row">
            {/* When 1 - Regular Inspection */}
            <div className="bg-white py-4 px-1 flex-1 flex flex-col items-center gap-2 text-center shadow rounded-2xl">
              <img
                src="/when-1.svg"
                alt="بشكل دوري icon"
                className="w-16 h-16"
              />
              <h4 className="lg:text-2xl font-bold">بشكل دوري</h4>
              <p className="leading-relaxed text-gray-500/85">
                يجب فحص المركبة بشكل دوري قبل انتهاء صلاحية الفحص
              </p>
            </div>

            {/* When 2 - Ownership Transfer */}
            <div className="bg-white py-4 px-1 flex-1 flex flex-col items-center gap-2 text-center shadow rounded-2xl">
              <img
                src="/when-2.svg"
                alt="عند نقل ملكية المركبة icon"
                className="w-16 h-16"
              />
              <h4 className="lg:text-2xl font-bold">عند نقل ملكية المركبة</h4>
              <p className="leading-relaxed text-gray-500/85">
                في حال عدم وجود فحص فني دوري ساري للمركبة
              </p>
            </div>

            {/* When 3 - Foreign Vehicles */}
            <div className="bg-white py-4 px-1 flex-1 flex flex-col items-center gap-2 text-center shadow rounded-2xl">
              <img
                src="/when-3.svg"
                alt="المركبات الأجنبية icon"
                className="w-16 h-16"
              />
              <h4 className="lg:text-2xl font-bold">المركبات الأجنبية</h4>
              <p className="leading-relaxed text-gray-500/85">
                خلال 15 يوم من تاريخ دخولها إلى المملكة في حال عدم وجود فحص فني
                ساري من خارج المملكة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Services Section */}
      <div className="w-full py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col">
          <h2 className="text-xl lg:text-center lg:text-3xl font-bold mb-8">
            خدمات منصة الفحص الفني الدوري
          </h2>
          <div className="flex gap-4 flex-col lg:flex-row lg:text-center">
            {/* Service 1 - Book Appointment */}
            <div className="lg:pe-10 min-h-72 py-4 px-1 flex-1 flex flex-col items-center  gap-2  rounded-2xl shadow">
              <img
                src="/service-1.svg"
                alt="حجز موعد الفحص icon"
                className="w-16 h-16"
              />
              <h4 className="lg:text-xl font-bold mt-4">حجز موعد الفحص</h4>
              <p className="leading-relaxed mb-2 text-black">
                تتيح المنصة لأصحاب المركبات حجز ومتابعة مواعيد الفحص وإعادة
                الفحص للمركبات الخاصة بهم.
              </p>
              <button
                onClick={() => {
                  sessionStorage.setItem("session", Date.now());
                  navigate("/new-date");
                }}
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors mt-auto bg-green-700 hover:bg-green-800 text-white w-fit px-4 py-2 rounded-md"
              >
                حجز موعد
              </button>
            </div>

            {/* Service 2 - Edit Appointment */}
            <div className="lg:pe-10 min-h-72 py-4 px-1 flex-1 flex flex-col justify-center items-center gap-2  rounded-2xl shadow">
              <img
                src="/service-2.svg"
                alt="تعديل موعد الفحص icon"
                className="w-16 h-16"
              />
              <h4 className="lg:text-xl font-bold mt-4">تعديل موعد الفحص</h4>
              <p className="leading-relaxed mb-2 text-black  ">
                تتيح للأفراد والمنشآت تعديل موعد الفحص السابق حجزها .{" "}
              </p>
              <button
                onClick={() => {
                  sessionStorage.setItem("session", Date.now());
                  navigate("/new-date");
                }}
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors mt-auto bg-green-700 hover:bg-green-800 text-white w-fit px-4 py-2 rounded-md"
              >
                تعديل موعد
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Inspection Steps Section */}
      <div className="w-full py-10 px-4" dir="rtl">
        <div className="max-w-6xl mx-auto flex flex-col">
          <h2 className="text-xl max-lg:text-center lg:text-3xl font-bold mb-8">
            خطوات ما قبل الفحص الفني الدوري
          </h2>
          <div className="flex gap-[2dvw] flex-col lg:flex-row">
            {/* Step 1 */}
            <div className="p-4 flex-1 flex flex-col items-center gap-4 text-center  rounded-2xl shadow-xl">
              <img
                src="/prestep-1.svg"
                alt="حجز موعد الفحص icon"
                className="w-12 h-12"
              />
              <h4 className="lg:text-xl font-bold ">حجز موعد الفحص</h4>
              <p className="text-base text-black max-w-sm text-pretty">
                حجز وإدارة المواعيد عبر المنصة بكل سهولة.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 flex-1 flex flex-col items-center gap-4 text-center  rounded-2xl shadow-xl">
              <img
                src="/prestep-2.svg"
                alt="فحص المركبة icon"
                className="w-12 h-12"
              />
              <h4 className="lg:text-xl font-bold ">فحص المركبة</h4>
              <p className="text-base text-black max-w-sm text-pretty">
                بعد تأكيد حجز الموعد إلكترونياً، يتم التوجه إلى موقع الفحص ليتم
                فحص المركبة.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 flex-1 flex flex-col items-center gap-4 text-center  rounded-2xl shadow-xl">
              <img
                src="/prestep-3.svg"
                alt="استلام نتيجة الفحص icon"
                className="w-12 h-12"
              />
              <h4 className="lg:text-xl font-bold ">استلام نتيجة الفحص</h4>
              <p className="text-base text-black max-w-sm text-pretty">
                ستصلك نتيجة الفحص فور الانتهاء عبر رسالة نصية SMS، إذا كانت
                النتيجة اجتياز المركبة للفحص سيتم وضع ملصق الفحص على الزجاج
                الأمامي، أما لو كانت النتيجة عدم اجتياز سيكون لديك فرصتين لإعادة
                الفحص خلال 14 يوم عمل بالسعر المخصص للإعادة مع التأكيد على ضرورة
                حجز موعد لإعادة الفحص
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Certified Partners Section */}
      <div className="w-full py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <h2 className="text-xl max-lg:text-center lg:text-3xl font-bold mb-8">
            الجهات المرخصة
          </h2>
          <p className="text-sm max-lg:max-w-sm -mt-6 lg:text-lg mb-6 text-center text-green-700">
            الجهات المرخصة من المواصفات السعودية لممارسة نشاط الفحص الفني الدوري
          </p>
          <div className="flex flex-row-reverse gap-2 items-center justify-center">
            <div className="flex-1 py-2 px-2  border-gray-400 rounded-xl shadow-sm ">
              <img
                src="/certified-1.png"
                alt="certified partner"
                className="h-10 mx-auto"
              />
            </div>
            <div className="flex-1 py-2 px-2 border border-gray-400 rounded-xl shadow-sm ">
              <img
                src="/certified-2.png"
                alt="certified partner"
                className="h-10 mx-auto"
              />
            </div>
            <div className="flex-1 py-2 px-4 border border-gray-400 rounded-xl shadow-sm ">
              <img
                src="/certified-3.png"
                alt="certified partner"
                className="h-10 mx-auto"
              />
            </div>
            <div className="flex-1 py-2 px-4 border border-gray-400 rounded-xl shadow-sm ">
              <img
                src="/certified-4.png"
                alt="certified partner"
                className="h-10 mx-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile App Promotion Section */}
      <div className="w-full bg-gray-100 pt-16 px-4">
        <div className="max-w-5xl mx-auto flex gap-10 flex-col lg:flex-row items-center">
          <img
            src="/home4.png"
            alt="app preview"
            className="mix-blend-darken order-1 lg:order-0 max-w-md w-3/4"
          />
          <div className="flex flex-col gap-8">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl lg:text-5xl font-bold text-green-700 mb-4 text-center lg:text-right">
                احجز موعد الفحص من جوالك
              </h2>
              <p className="max-lg:px-8 lg:text-2xl mb-6 text-center lg:text-right text-gray-700">
                بسهولة وبساطة يمكنك حجز موعد الفحص في أقرب مركز لموقعك
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
