"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import ImageSlider from "@/components/ImageSlider";
import { Project } from "@/types/project";
import { ProjectImage } from "@/types/image";
import { ProjectsAPI } from "@/lib/api/projects";
import { ImageAPI } from "@/lib/api/images";

interface ProjectDetailProps {
  params: Promise<{ id: string }>;
}

export default function PublicProjectDetail({ params }: ProjectDetailProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string>("");
  const router = useRouter();

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
          ProjectsAPI.getById(id),
          ImageAPI.getProjectImages(id)
        ]);
        
        if (!projectData) {
          setError("プロジェクトが見つかりません");
          return;
        }

        // 非公開プロジェクトの場合はアクセス拒否
        if (!projectData.isPublic) {
          setError("このプロジェクトは非公開です");
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* ヘッダー */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center gap-3">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Image 
                  src="/icon.png" 
                  alt="ポートフォリオ" 
                  width={48} 
                  height={48}
                  className="rounded"
                />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
                <p className="text-gray-600 text-sm">個人開発プロジェクト集</p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-red-500 text-lg mb-4">{error || "プロジェクトが見つかりません"}</div>
            <Link
              href="/"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ← ポートフォリオに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Image 
                  src="/icon.png" 
                  alt="ポートフォリオ" 
                  width={48} 
                  height={48}
                  className="rounded"
                />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
                <p className="text-gray-600 text-sm">個人開発プロジェクト集</p>
              </div>
            </div>
            
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
            >
              ← 一覧に戻る
            </Link>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* プロジェクトタイトル */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {project.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span>作成日: {formatDate(project.createdAt)}</span>
            <span>更新日: {formatDate(project.updatedAt)}</span>
            {images.length > 0 && (
              <span>{images.length} 枚の画像</span>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* 画像スライダー */}
          {images.length > 0 && (
            <section>
              <ImageSlider images={images} />
            </section>
          )}
          
          {/* プロジェクト説明 */}
          <section>
            {project.description ? (
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">プロジェクト概要</h2>
                <div className="prose prose-gray max-w-none">
                  <MarkdownRenderer content={project.description} />
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
                プロジェクトの説明はまだ作成されていません
              </div>
            )}
          </section>

          {/* リンクセクション */}
          {(project.url || project.githubLink) && (
            <section>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">リンク</h2>
                <div className="flex flex-wrap gap-4">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      デモサイトを見る
                    </a>
                  )}
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHubで見る
                    </a>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
        
        {/* ナビゲーション */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex justify-center">
          <Link
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            ← 他のプロジェクトを見る
          </Link>
        </div>
      </div>
    </div>
  );
}