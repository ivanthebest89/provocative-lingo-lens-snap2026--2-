import React, { useRef, useState } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageUploader({ onImageSelected, imagePreview, onClear }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onImageSelected(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onImageSelected(file);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {imagePreview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-50"
          >
            <img
              src={imagePreview}
              alt="Uploaded"
              className="w-full max-h-[400px] object-contain rounded-2xl"
            />
            <button
              onClick={onClear}
              className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300
              flex flex-col items-center justify-center py-16 px-6
              ${isDragging
                ? "border-violet-500 bg-violet-50/60"
                : "border-slate-200 bg-slate-50/50 hover:border-violet-300 hover:bg-violet-50/30"
              }
            `}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mb-5">
              <ImageIcon className="w-7 h-7 text-violet-600" />
            </div>
            <p className="text-slate-800 font-semibold text-lg mb-1">
              Drop your image here
            </p>
            <p className="text-slate-400 text-sm mb-5">
              or click to browse · PNG, JPG, WEBP
            </p>
            <Button variant="outline" size="sm" className="rounded-full px-5 border-violet-200 text-violet-700 hover:bg-violet-50">
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}