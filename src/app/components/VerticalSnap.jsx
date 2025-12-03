"use client";
import { useEffect, useRef } from "react";

export default function VerticalSnap({ children }) {
  const containerRef = useRef(null);
  const pageIndex = useRef(0);
  const scrollLocked = useRef(false);
  const touchStartY = useRef(0);
  const scrollTimeout = useRef(null);

  const PAGE_COUNT = children.length;
  const PAGE_HEIGHT = () => window.innerHeight;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollToPage = (index, instant = false) => {
      if (scrollLocked.current && !instant) return;
      
      scrollLocked.current = true;
      pageIndex.current = index;

      container.scrollTo({
        top: index * PAGE_HEIGHT(),
        behavior: instant ? "instant" : "smooth",
      });

      // Fallback unlock
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        scrollLocked.current = false;
      }, 600);
    };

    const handleScrollEnd = () => {
      scrollLocked.current = false;
      
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = null;
      }

      // Snap correction
      const target = pageIndex.current * PAGE_HEIGHT();
      const diff = Math.abs(container.scrollTop - target);

      if (diff > 1) {
        container.scrollTo({ top: target });
      }
    };

    container.addEventListener("scrollend", handleScrollEnd);

    /* DESKTOP WHEEL - With infinite loop */
    let wheelTimeout = null;
    const handleWheel = (e) => {
      e.preventDefault();

      if (wheelTimeout) clearTimeout(wheelTimeout);

      if (scrollLocked.current) {
        wheelTimeout = setTimeout(() => {
          if (!scrollLocked.current) {
            processWheelScroll(e.deltaY);
          }
        }, 50);
        return;
      }

      processWheelScroll(e.deltaY);
    };

    const processWheelScroll = (deltaY) => {
      const direction = deltaY > 0 ? 1 : -1;
      let next = pageIndex.current + direction;

      // INFINITE LOOP LOGIC
      if (next < 0) {
        // Going up from first page → jump to last page
        next = PAGE_COUNT - 1;
      } else if (next >= PAGE_COUNT) {
        // Going down from last page → jump to first page
        next = 0;
      }

      scrollToPage(next);
    };

    /* MOBILE TOUCH - With infinite loop */
    const handleTouchStart = (e) => {
      const isInteractive = e.target.closest(
        "button, a, input, textarea, select, [role='button']"
      );
      if (isInteractive) return;

      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (scrollLocked.current) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e) => {
      if (scrollLocked.current) return;

      const endY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - endY;

      // Minimum swipe threshold
      if (Math.abs(diff) < 50) {
        scrollToPage(pageIndex.current);
        return;
      }

      const direction = diff > 0 ? 1 : -1;
      let next = pageIndex.current + direction;

      // INFINITE LOOP LOGIC
      if (next < 0) {
        // Swipe down from first page → jump to last page
        next = PAGE_COUNT - 1;
      } else if (next >= PAGE_COUNT) {
        // Swipe up from last page → jump to first page
        next = 0;
      }

      scrollToPage(next);
    };

    // Prevent manual scrolling
    const handleScroll = () => {
      if (!scrollLocked.current) {
        const target = pageIndex.current * PAGE_HEIGHT();
        const current = container.scrollTop;
        const diff = Math.abs(current - target);

        if (diff > 5) {
          container.scrollTo({ top: target });
        }
      }
    };

    /* LISTENERS */
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });
    container.addEventListener("scroll", handleScroll, { passive: true });

    // Initial position
    container.scrollTo({ top: 0, behavior: "instant" });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("scrollend", handleScrollEnd);
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [PAGE_COUNT]);

  return (
    <div
      ref={containerRef}
      className="h-[100svh] w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
      style={{
        scrollSnapType: "y mandatory",
        overscrollBehavior: "contain",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {children.map((child, index) => (
        <div key={index} className="h-[100svh] w-full snap-start">
          {child}
        </div>
      ))}
    </div>
  );
}