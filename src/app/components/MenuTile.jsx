"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductDetail from "./ProductDetail";
export default function MenuTile({ item, index, language, onOpenProduct }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => setShowDrawer(true), 600);
    }
  };

  const handleClose = () => {
    setShowDrawer(false);
    setTimeout(() => setIsOpen(false), 500);
  };

  const title = language === "de" ? item.title_de : item.title_en;
  const subtitle = language === "de" ? item.subtitle_de : item.subtitle_en;

  return (
    <div className="relative h-full w-full snap-center">
      {/* Background Image */}
      <img
        src={item.image_url}
        alt={title}
        className="absolute inset-0 object-cover w-full h-full"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      {/* Fixed Logo - Top Left */}
      <div className="absolute top-6 left-6 z-10">
        <img 
          src="/logo.svg"
          alt="Restaurant Logo" 
          className="h-14 w-auto drop-shadow-lg"
        />
      </div>
      
      {/* Bottom-left text */}
      <div className="absolute bottom-6 left-6 text-white max-w-md">
        <h1 className="text-xl font-bold mb-2">{title}</h1>
        <p className="text-base opacity-90">{subtitle}</p>
      </div>
      
      {/* Bottom-right animated button */}
      <motion.button
        onClick={handleOpen}
        initial={{ width: 'auto', borderRadius: 9999 }}
        animate={{
          width: isOpen ? '100%' : 'auto',
          borderRadius: isOpen ? 0 : 9999,
          right: isOpen ? 0 : '1.5rem',
          left: isOpen ? 0 : 'auto',
          opacity: showDrawer ? 0 : 1,
          pointerEvents: showDrawer ? 'none' : 'auto',
          boxShadow: isOpen
            ? '0 0 0 rgba(0,0,0,0)'
            : '0 4px 12px rgba(0,0,0,0.15)',
        }}
        transition={{
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="absolute bottom-6 bg-white overflow-hidden z-30 flex items-center justify-center px-6 py-3 font-semibold"
        style={{
          height: 60,
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {!isOpen && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            Information
            <span className="text-xl">+</span>
          </motion.div>
        )}
      </motion.button>

      {/* Product Detail Drawer */}
      <AnimatePresence>
        {showDrawer && (
          <ProductDetail
            item={item}
            onClose={handleClose}
            language={language}
          />
        )}
      </AnimatePresence>
    </div>
  );
}