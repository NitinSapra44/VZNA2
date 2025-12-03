"use client";
import { useEffect, useRef } from "react";

export default function VerticalSnap({ children }) {
  const ref = useRef(null);
  const isLocked = useRef(false);
  const currentPage = useRef(0);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const PAGE_COUNT = children.length;
    const THRESHOLD = 40;

    const pageHeight = () => window.innerHeight;

    /* ------------------------------------------------
       1) KEEP SCROLL TOP EXACTLY AT PAGE BOUNDARIES
       ------------------------------------------------*/
    const correctScrollDrift = () => {
      if (isLocked.current) return; // don't correct mid-snap

      const target = currentPage.current * pageHeight();
      const diff = Math.abs(container.scrollTop - target);

      if (diff > 2) {
        // Drift detected → pull back instantly
        container.scrollTo({ top: target });
      }
    };

    container.addEventListener("scroll", correctScrollDrift);

    /* ------------------------------------------------
       2) Unlock after animation ends
       ------------------------------------------------*/
    const unlock = () => {
      isLocked.current = false;
      correctScrollDrift(); // clean drift after every snap
    };

    container.addEventListener("scrollend", unlock);

    /* ------------------------------------------------
       3) Desktop wheel scroll
       ------------------------------------------------*/
    const handleWheel = (e) => {
      e.preventDefault();
      if (isLocked.current) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const next = currentPage.current + direction;

      if (next < 0 || next >= PAGE_COUNT) return;

      isLocked.current = true;
      currentPage.current = next;

      container.scrollTo({
        top: next * pageHeight(),
        behavior: "smooth",
      });
    };

    /* ------------------------------------------------
       4) Touch scroll
       ------------------------------------------------*/
    let startY = 0;
    const handleTouchStart = (e) => {
      const interactive = e.target.closest("button, a, input, textarea, select, [role='button']");
      if (interactive) return;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (isLocked.current) return;

      const diff = startY - e.changedTouches[0].clientY;

      if (Math.abs(diff) < THRESHOLD) {
        container.scrollTo({
          top: currentPage.current * pageHeight(),
          behavior: "smooth",
        });
        return;
      }

      const direction = diff > 0 ? 1 : -1;
      const next = currentPage.current + direction;

      if (next < 0 || next >= PAGE_COUNT) {
        container.scrollTo({
          top: currentPage.current * pageHeight(),
          behavior: "smooth",
        });
        return;
      }

      isLocked.current = true;
      currentPage.current = next;

      container.scrollTo({
        top: next * pageHeight(),
        behavior: "smooth",
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("scroll", correctScrollDrift);
      container.removeEventListener("scrollend", unlock);
    };
  }, [children.length]);

  return (
    <div
      ref={ref}
      className="h-[100svh] w-full overflow-y-scroll snap-mandatory snap-y no-scrollbar"
      style={{
        scrollSnapType: "y mandatory",
        overscrollBehavior: "contain",
      }}
    >
      {children.map((child, i) => (
        <div key={i} className="snap-start h-[100svh] w-full">
          {child}
        </div>
      ))}
    </div>
  );
}
