"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  label?: string;
  accept?: string;
  className?: string;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  label = "画像をアップロード",
  accept = "image/*",
  className = ""
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value || "");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください。');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setPreview(imageUrl);
      onChange(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative">
          <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden">
            <Image
              src={preview}
              alt="プレビュー"
              fill
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
          >
            ×
          </button>
          <button
            type="button"
            onClick={handleClick}
            className="mt-2 text-blue-500 hover:text-blue-600 text-sm"
          >
            画像を変更
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            w-full h-48 border-2 border-dashed rounded-lg cursor-pointer
            flex flex-col items-center justify-center text-gray-500
            hover:bg-gray-50 transition-colors
            ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          `}
        >
          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-gray-400">
            クリックまたはドラッグ&ドロップで追加
          </p>
        </div>
      )}
    </div>
  );
}