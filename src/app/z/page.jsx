"use client";
import { useRouter } from "next/navigation";
import { useAppStore } from "../../store/appStore";
import { useEffect, useRef, useState } from "react";
import AppViewport from "../components/AppViewport";
import LanguageToggle from "../components/LanguageToggle";
import Lottie from "lottie-react";
import animationData from "../../../public/animation_01_1920x1080.json";
import animationData2 from "../../../public/animation_rz.json";

export default function LanguageScreen() {
  const router = useRouter();
  const { language } = useAppStore();
  
  const swipeStartY = useRef(null);
  const isNavigating = useRef(false);
  const lastScrollTime = useRef(0);

  // 🔹 Loader state
  const [showContent, setShowContent] = useState(false);

  const navigateToMenu = () => {
    if (isNavigating.current) return;
    
    const now = Date.now();
    if (now - lastScrollTime.current < 800) return;
    
    lastScrollTime.current = now;
    isNavigating.current = true;
    
    const currentLanguage = useAppStore.getState().language;
    router.push(`/z/${currentLanguage}`);
  };

  // 🔹 Delay after animation (3–4 seconds depending on your animation length)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2000); // change to animation duration

    return () => clearTimeout(timer);
  }, []);

  // 🔹 User swipe/wheel navigation logic remains same
  useEffect(() => {
    const handleWheel = (event) => {
      if (!showContent) return; // Prevent scrolling until content is visible

      event.preventDefault();
      const now = Date.now();
      if (now - lastScrollTime.current < 800) return;
      
      if (event.deltaY > 30) navigateToMenu();
    };

    const handleTouchStart = (e) => {
      if (!showContent) return;
      swipeStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (!showContent) return;
      const endY = e.changedTouches[0].clientY;
      const swipeDistance = swipeStartY.current - endY;
      
      if (swipeDistance > 50) navigateToMenu();
      swipeStartY.current = null;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [showContent]);

  return (
    <AppViewport>

      {/* 🔹 Full-screen Lottie Loader */}
      {!showContent && (
        <div className="flex items-center justify-center h-full w-full bg-[#DBDBDB]">
          <Lottie 
            animationData={animationData2}
            autoplay
            loop={false}
          />
        </div>
      )}

      {/* 🔹 Page content fades in */}
      {showContent && (
        <div className="animate-fade-in flex flex-col items-center justify-center h-full gap-8 bg-[#DBDBDB]">
          <div className="bg-white h-[95%] w-[90%] rounded-3xl flex flex-col items-center justify-center gap-6">
            <h2 className="text-xl font-semibold text-gray-600">Sprache wählen</h2>

            <LanguageToggle />

            <div style={{ width: "120%" }}>
              <Lottie animationData={animationData} loop autoplay />
            </div>

            <p className="text-sm text-gray-400">Swipe nach oben zum Fortfahren ⬆️</p>
          </div>
        </div>
      )}

    </AppViewport>
  );
}
