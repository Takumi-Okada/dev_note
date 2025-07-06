"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types/project";
import { ProjectImage } from "@/types/image";
import { ProjectsAPI } from "@/lib/api/projects";
import { ImageAPI } from "@/lib/api/images";

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectImages, setProjectImages] = useState<{ [key: string]: ProjectImage[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProjects = await ProjectsAPI.getAll();
        // 公開プロジェクトのみフィルタ
        const publicProjects = allProjects.filter(project => project.isPublic);
        setProjects(publicProjects);

        // 各プロジェクトの画像を取得
        const imagesPromises = publicProjects.map(async (project) => {
          const images = await ImageAPI.getProjectImages(project.id);
          return { projectId: project.id, images };
        });

        const imagesResults = await Promise.all(imagesPromises);
        const imagesMap: { [key: string]: ProjectImage[] } = {};
        imagesResults.forEach(({ projectId, images }) => {
          imagesMap[projectId] = images;
        });
        setProjectImages(imagesMap);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image 
                src="/icon.png" 
                alt="ポートフォリオ" 
                width={48} 
                height={48}
                className="rounded"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DevNote</h1>
                <p className="text-gray-600 text-sm">個人開発プロジェクト</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">読み込み中...</div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">公開されているプロジェクトがありません</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const images = projectImages[project.id] || [];
              const mainImage = images[0];
              
              return (
                <div key={project.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  {mainImage ? (
                    <div className="relative h-64">
                      <Image
                        src={ImageAPI.getImageUrl(mainImage.filePath)}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-lg">No Image</span>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {project.title}
                    </h3>
                    
                    {project.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {project.description.slice(0, 100)}...
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{formatDate(project.createdAt)}</span>
                      {images.length > 1 && (
                        <span>{images.length} 枚の画像</span>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <Link
                        href={`/projects/${project.id}`}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm font-medium transition-colors"
                      >
                        詳細を見る
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}