"use client";

import { useState } from "react";
import Image from "next/image";
import { ProjectImage } from "@/types/image";
import { ImageAPI } from "@/lib/api/images";

interface ImageSliderProps {
  images: ProjectImage[];
  className?: string;
}

export default function ImageSlider({ images, className = "" }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (images.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center h-64 ${className}`}>
        <span className="text-gray-400 text-lg">画像がありません</span>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={className}>
      {/* メイン画像表示 */}
      <div className="relative">
        <div 
          className="relative h-64 md:h-96 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setIsFullscreen(true)}
        >
          <Image
            src={ImageAPI.getImageUrl(currentImage.filePath)}
            alt={currentImage.fileName}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          
          {/* 画像数表示 */}
          {images.length > 1 && (
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
          
          {/* 前へボタン */}
          {images.length > 1 && currentIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {/* 次へボタン */}
          {images.length > 1 && currentIndex < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* サムネイルパネル */}
        {images.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => goToSlide(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Image
                  src={ImageAPI.getImageUrl(image.filePath)}
                  alt={image.fileName}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* フルスクリーンモーダル */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-5xl max-h-full w-full h-full flex items-center justify-center">
            {/* 閉じるボタン */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* フルスクリーン画像 */}
            <div className="relative w-full h-full">
              <Image
                src={ImageAPI.getImageUrl(currentImage.filePath)}
                alt={currentImage.fileName}
                fill
                className="object-contain"
              />
            </div>

            {/* フルスクリーン前へボタン */}
            {images.length > 1 && currentIndex > 0 && (
              <button
                onClick={goToPrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* フルスクリーン次へボタン */}
            {images.length > 1 && currentIndex < images.length - 1 && (
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* フルスクリーン画像数表示 */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}