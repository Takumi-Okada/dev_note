"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ProjectImage } from '@/types/image';
import { ImageAPI } from '@/lib/api/images';
import { AdminImagesAPI } from '@/lib/api/admin-images';

interface ImageGalleryProps {
  projectId: string;
  className?: string;
  isAdmin?: boolean;
}

export default function ImageGallery({ projectId, className = "", isAdmin = false }: ImageGalleryProps) {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const loadImages = useCallback(async () => {
    setLoading(true);
    try {
      const projectImages = await ImageAPI.getProjectImages(projectId);
      setImages(projectImages);
    } catch (error) {
      console.error('画像の取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // 画像一覧を取得
  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // ファイルアップロード処理
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      if (!file.type.startsWith('image/')) {
        console.error('画像ファイルのみアップロード可能です');
        return null;
      }

      const result = await ImageAPI.uploadImage(file, projectId);
      if (result.success && result.image) {
        return result.image;
      } else {
        console.error('アップロードに失敗しました:', result.error);
        return null;
      }
    });

    try {
      const uploadedImages = await Promise.all(uploadPromises);
      const validImages = uploadedImages.filter((img): img is ProjectImage => img !== null);
      setImages(prev => [...prev, ...validImages]);
    } catch (error) {
      console.error('アップロードエラー:', error);
    } finally {
      setUploading(false);
    }
  };

  // 画像削除
  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('この画像を削除しますか？')) return;

    try {
      if (isAdmin) {
        await AdminImagesAPI.deleteImage(imageId);
      } else {
        const success = await ImageAPI.deleteImage(imageId);
        if (!success) {
          throw new Error('画像の削除に失敗しました');
        }
      }
      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('画像の削除に失敗しました:', error);
      alert('画像の削除に失敗しました');
    }
  };

  // ドラッグ&ドロップ処理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // ファイル選択
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-8">
          <div className="text-gray-500">画像を読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">プロジェクト画像</h3>
        
        {/* アップロードエリア */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="image-upload"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer block"
          >
            <div className="text-gray-500">
              <div className="text-2xl mb-2">📸</div>
              <div className="text-sm">
                {uploading ? 'アップロード中...' : 'クリックまたはドラッグ&ドロップで画像をアップロード'}
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* 画像一覧 */}
      {images.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          まだ画像がありません
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                <Image
                  src={ImageAPI.getImageUrl(image.filePath)}
                  alt={image.fileName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              
              {/* 削除ボタン */}
              <button
                onClick={() => handleDeleteImage(image.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="削除"
              >
                ×
              </button>
              
              {/* ファイル名 */}
              <div className="mt-2 text-xs text-gray-500 truncate">
                {image.fileName}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}