
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

// ProductDetail Component with animation
export default function ProductDetail({ item, onClose, language }) {
  const [selectedSize, setSelectedSize] = useState(item.sizes[0]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleOption = (option) => {
    if (selectedOptions.includes(option.type)) {
      setSelectedOptions(selectedOptions.filter(o => o !== option.type));
    } else {
      setSelectedOptions([...selectedOptions, option.type]);
    }
  };

  const title = language === "de" ? item.title_de : item.title_en;
  const ingredients = language === "de" ? item.ingredients_de : item.ingredients_en;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="fixed inset-0 z-50 flex items-end justify-center pb-4 mb-4"
    >
      <div className="w-full max-w-[560px] mx-auto relative">
        {/* White Modal Container */}
        <div className="bg-white rounded-t-3xl mt-32 p-6 pb-8 shadow-2xl relative z-10">
          {/* Product Title & Ingredients */}
          <div className="mb-6">
            <h2 style={{ fontFamily: 'var(--font-fira-sans)' }} className="text-base  mb-3">{title}</h2>
            <p style={{ fontFamily: 'var(--font-fira-sans)' }} className="text-gray-600 text-base leading-relaxed">{ingredients}</p>
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <div className="flex gap-3">
              {item.sizes.map((size, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSize(size)}
                  className={`flex-1 border-2 rounded-lg p-3 text-center transition-all ${
                    selectedSize === size ? 'border-black bg-gray-50' : 'border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-sm">
                    {language === "de" ? size.label_de : size.label_en}
                  </div>
                  <div className="text-lg font-bold mt-1">{size.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Options */}
          {item.options && item.options.length > 0 && (
            <div className="mb-6">
              <div className="flex gap-3">
                {item.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleOption(option)}
                    className={`flex-1 border-2 rounded-lg p-3 text-center transition-all ${
                      selectedOptions.includes(option.type) ? 'border-black bg-gray-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                      {option.type === 'glutenfrei' && (
                        <Image src="/GlutenFree.svg" alt="Gluten Free" width={40} height={40} />
                      )}
                      {option.type === 'vegan' && (
                        <Image src="/Vegan.svg" alt="Gluten Free" width={40} height={40} /> 
                      )}
                      {option.type === 'vollkorn' && (
                        <Image src="/Vollkorn.svg" alt="Gluten Free" width={40} height={40} /> 
                      )}
                    </div>
                    <div className="font-semibold text-xs">
                      {language === "de" ? option.label_de : option.label_en}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {option.price_modifier}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-black text-white rounded-full py-4 font-semibold flex items-center justify-center gap-2"
          >
            {language === "de" ? "Schliessen" : "Close"}
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}