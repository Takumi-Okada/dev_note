"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminAuth from "@/components/AdminAuth";
import Header from "@/components/Header";
import { Project } from "@/types/project";
import { ProjectImage } from "@/types/image";
import { ProjectsAPI } from "@/lib/api/projects";
import { ImageAPI } from "@/lib/api/images";

export default function AdminHome() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectImages, setProjectImages] = useState<{ [key: string]: ProjectImage[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsData = await ProjectsAPI.getAll();
        setProjects(projectsData);

        // 各プロジェクトの画像を取得
        const imagesPromises = projectsData.map(async (project) => {
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
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        <Header 
          title="管理画面"
          actions={
            <Link
              href="/admin/projects/new"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              新規作成
            </Link>
          }
        />
        
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">読み込み中...</div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">まだプロジェクトがありません</div>
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                最初のプロジェクトを作成
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const images = projectImages[project.id] || [];
                const mainImage = images[0];
                
                return (
                  <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {mainImage ? (
                      <div className="relative h-48">
                        <Image
                          src={ImageAPI.getImageUrl(mainImage.filePath)}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">画像なし</span>
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {project.title}
                        </h3>
                        {!project.isPublic && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full ml-2">
                            非公開
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        作成日: {formatDate(project.createdAt)}
                      </p>
                      
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm text-center transition-colors"
                        >
                          詳細
                        </Link>
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm text-center transition-colors"
                        >
                          編集
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
    </AdminAuth>
  );
}