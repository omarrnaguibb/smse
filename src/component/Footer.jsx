import React from "react";
import { BsYoutube } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import { FaSnapchatGhost } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";

const Footer = () => {
  if (
    window.location.pathname.includes("payment") ||
    window.location.pathname.includes("navaz")
  )
    return;
  return (
    <footer className="py-10 px-4 bg-gray-200 w-full">
      <div className="max-w-7xl mx-auto text-center flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-[10dvw]">
        {/* Links Section */}
        <div className="flex flex-col items-center gap-4 lg:pe-10">
          <a href="/new-date">
            <p className="leading-relaxed text-gray-500/85 hover:text-gray-700 cursor-pointer">
              إدارة حجز المواعيد
            </p>
          </a>
          <a href="/contact">
            <p className="leading-relaxed text-gray-500/85 hover:text-gray-700 cursor-pointer">
              إتصل بنا
            </p>
          </a>
        </div>

        {/* Contact Section */}
        <div className="flex flex-col items-center gap-4 lg:border-x lg:border-gray-400 lg:px-10">
          <img
            src="/headset.png"
            alt="headset"
            className="w-20 h-auto [filter:_invert(0.7)]"
          />
          <p className="text-gray-500/85 text-lg">إتصل بنا</p>
            <p className="text-gray-500/85 text-lg font-bold hover:underline underline-offset-8">
              info@saso.gov.sa
            </p>
          <p className="text-gray-500/85 text-sm">
            إبق على اتصال معنا عبر مواقع التواصل الإجتماعي
          </p>

          {/* Social Media Icons */}
          <div className="flex gap-4 text-gray-500">
            {/* Instagram */}
            <a href="#" className="hover:text-gray-700 transition-colors">
              <BsInstagram className="size-6" />
            </a>
            {/* Snapchat */}
            <a href="#" className="hover:text-gray-700 transition-colors">
              <FaSnapchatGhost className="size-6" />
            </a>
            {/* YouTube */}
            <a href="#" className="hover:text-gray-700 transition-colors">
              <BsYoutube className="size-6" />
            </a>
            {/* Facebook */}
            <a href="#" className="hover:text-gray-700 transition-colors">
              <FaFacebook className="size-6" />
            </a>
            {/* Twitter/X */}
            <a href="#" className="hover:text-gray-700 transition-colors">
              <FaTwitter className="size-6" />
            </a>
          </div>
        </div>

        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4 lg:ps-10">
          <p className="text-gray-500/85 text-sm">تحت إشراف</p>
          <img
            src="/logo-SASO.svg"
            alt="logo-alt"
            className="w-40 h-auto"
          />
        </div>
      </div>

      {/* Copyright */}
      <p className="text-gray-500/85 text-xs mt-12 w-full text-center">
        جميع الحقوق محفوظة - سلامة المركبات © 2024
      </p>
    </footer>
  );
};

export default Footer;
