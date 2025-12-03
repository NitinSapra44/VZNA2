"use client";
import { useEffect, useRef } from "react";

export default function VerticalSnap({ children }) {
  const containerRef = useRef(null);

  // TRUE page index — never rely on scrollTop
  const pageIndex = useRef(0);

  // Lock while animation is in progress
  const scrollLocked = useRef(false);

  // For touch detection
  const touchStartY = useRef(0);

  const PAGE_COUNT = children.length;
  const PAGE_HEIGHT = () => window.innerHeight; // correct at all times

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* --------------------------------------------
       HARD-LOCK SCROLLING (Like TikTok)
       One scroll → one snap → never skip
    --------------------------------------------- */

    const scrollToPage = (index) => {
      scrollLocked.current = true;

      container.scrollTo({
        top: index * PAGE_HEIGHT(),
        behavior: "smooth",
      });
    };

    /* --------------------------------------------
       Unlock strictly after smooth scrolling ends
       (scrollend works on Safari + Chrome)
    --------------------------------------------- */
    const handleScrollEnd = () => {
      scrollLocked.current = false;

      // Correct any micro drift instantly
      const target = pageIndex.current * PAGE_HEIGHT();
      const diff = Math.abs(container.scrollTop - target);

      if (diff > 1) {
        container.scrollTo({ top: target });
      }
    };

    container.addEventListener("scrollend", handleScrollEnd);

    /* --------------------------------------------
       Desktop wheel scroll
    --------------------------------------------- */
    const handleWheel = (e) => {
      e.preventDefault(); // FULL control

      if (scrollLocked.current) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const next = pageIndex.current + direction;

      if (next < 0 || next >= PAGE_COUNT) return;

      pageIndex.current = next;
      scrollToPage(next);
    };

    /* --------------------------------------------
       Mobile touch swipe
    --------------------------------------------- */
    const handleTouchStart = (e) => {
      const isInteractive = e.target.closest(
        "button, a, input, textarea, select, [role='button']"
      );
      if (isInteractive) return;

      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (scrollLocked.current) return;

      const endY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - endY;

      // Swipe threshold
      if (Math.abs(diff) < 40) {
        // Snap back
        scrollToPage(pageIndex.current);
        return;
      }

      const direction = diff > 0 ? 1 : -1;
      const next = pageIndex.current + direction;

      if (next < 0 || next >= PAGE_COUNT) {
        scrollToPage(pageIndex.current);
        return;
      }

      pageIndex.current = next;
      scrollToPage(next);
    };

    /* --------------------------------------------
       LISTENERS
    --------------------------------------------- */
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });

    /* --------------------------------------------
       INITIAL positioning (must be exact)
    --------------------------------------------- */
    container.scrollTo({ top: 0 });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("scrollend", handleScrollEnd);
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
