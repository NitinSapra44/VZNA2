"use client";
import { useRouter } from "next/navigation";
import { useAppStore } from "../../store/appStore";
import { useEffect, useState } from "react";
import AppViewport from "../components/AppViewport";
import LanguageToggle from "../components/LanguageToggle";
import Lottie from "lottie-react";
import animationData from "../../../public/animation_01_1920x1080.json";
import animationData2 from "../../../public/animation_rz.json";
import Image from "next/image";

export default function LanguageScreen() {
  const router = useRouter();
  const { language } = useAppStore();

  const [showContent, setShowContent] = useState(false);

  // ⏳ Show content after intro animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppViewport>
      {/* 🔹 Intro Animation (Full Screen) */}
      {!showContent && (
        <div className="flex items-center justify-center h-full w-full">
          <Lottie animationData={animationData2} autoplay loop={false} />
        </div>
      )}

      {/* 🔹 Main Screen */}
      {showContent && (
        <div className="animate-fade-in flex flex-col items-center justify-center h-full gap-8 bg-[#DBDBDB]">
          <div className="bg-white h-[95%] w-[90%] rounded-3xl flex flex-col items-center justify-center gap-6">

            {/* Heading */}
            <h2 style={{ fontFamily: 'var(--font-fira-sans)' }} className="text-xl font-semibold text-gray-600">
              {language === "de" ? "Impressum" : "Welcome"}
            </h2>

            {/* Language Toggle */}
            <LanguageToggle />

            {/* Main Animation */}
            <div style={{ width: "100%" }}>
              <Lottie animationData={animationData} loop autoplay />
            </div>

            {/* 🔹 Instruction Text */}
            <p style={{ fontFamily: 'var(--font-fira-sans)' }} className="text-center text-gray-600 text-lg px-6 leading-snug">
              {language === "de"
                ? "Streiche nach oben, um das Menü zu entdecken."
                : "Swipe up to discover the menu."}
            </p>

            {/* 🔹 Dynamic Button */}
            <button 
            style={{ fontFamily: 'var(--font-fira-sans)' }}
              onClick={() => router.push(`/d/${language}`)}
              className="flex items-center gap-4 bg-[#4CAF50] text-white font-semibold px-6 py-3 rounded-full text-lg active:scale-95 transition-all shadow-md"
            >
              {language === "de" ? "Verstanden" : "Got it"}

              <span className="bg-[#2E7D32] rounded-full w-8 h-8 flex items-center justify-center">
                <Image src="/Check.svg" alt="Arrow Right" width={16} height={16} />
              </span>
            </button>
          </div>
        </div>
      )}
    </AppViewport>
  );
}
