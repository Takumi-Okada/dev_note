"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminAuth from "@/components/AdminAuth";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import Header from "@/components/Header";
import ImageGallery from "@/components/ImageGallery";
import { Project } from "@/types/project";
import { ProjectImage } from "@/types/image";
import { AdminProjectsAPI } from "@/lib/api/admin-projects";
import { ImageAPI } from "@/lib/api/images";

interface ProjectDetailProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetail({ params }: ProjectDetailProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const [projectData, imagesData] = await Promise.all([
          AdminProjectsAPI.getById(id),
          ImageAPI.getProjectImages(id)
        ]);
        
        if (!projectData) {
          setError("プロジェクトが見つかりません");
          return;
        }
        
        setProject(projectData);
        setImages(imagesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "プロジェクトの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error || "プロジェクトが見つかりません"}</div>
        </div>
      </div>
    );
  }

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
          title={project.title}
          showBackButton={true}
          backHref="/admin"
          backLabel="← 管理画面"
          actions={
            <>
              <Link
                href={`/admin/projects/${id}/description/edit`}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                説明を編集
              </Link>
              <Link
                href={`/admin/projects/${id}/edit`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                基本情報編集
              </Link>
            </>
          }
        />
        
        <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            作成日: {formatDate(project.createdAt)} | 更新日: {formatDate(project.updatedAt)}
          </p>
          {!project.isPublic && (
            <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              非公開
            </span>
          )}
        </div>

        <main className="space-y-8">
        {images.length > 0 && (
          <section>
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
              <Image
                src={ImageAPI.getImageUrl(images[0].filePath)}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </section>
        )}
        
        <section>
          {project.description ? (
            <MarkdownRenderer content={project.description} />
          ) : (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-lg mb-4">まだ説明が作成されていません</p>
              <Link
                href={`/admin/projects/${id}/description/edit`}
                className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                📝 説明を追加する
              </Link>
            </div>
          )}
        </section>

        <section>
          <ImageGallery projectId={id} isAdmin={true} />
        </section>

        <section className="flex gap-4">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              デモを見る
            </a>
          )}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-colors"
            >
              GitHub
            </a>
          )}
        </section>
        </main>
        </div>
      </div>
    </AdminAuth>
  );
}