"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminAuth from "@/components/AdminAuth";
import MarkdownEditor from "@/components/MarkdownEditor";
import Header from "@/components/Header";
import { Project } from "@/types/project";
import { ProjectsAPI } from "@/lib/api/projects";

interface EditDescriptionProps {
  params: Promise<{ id: string }>;
}

export default function EditDescription({ params }: EditDescriptionProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        const data = await ProjectsAPI.getById(id);
        if (!data) {
          setError("プロジェクトが見つかりません");
          return;
        }
        setProject(data);
        setDescription(data.description || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "プロジェクトの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleSave = async () => {
    if (!project) return;

    try {
      setSaving(true);
      setError(null);

      await ProjectsAPI.update({
        id: project.id,
        description: description
      });

      // 保存成功後、管理画面の詳細ページに遷移
      router.push(`/admin/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "説明の保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">プロジェクトが見つかりません</div>
      </div>
    );
  }

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
      <Header 
        title={`${project.title} - 説明を編集`}
        showBackButton={true}
        backHref={`/admin/projects/${id}`}
        backLabel={`← ${project.title}`}
        actions={
          <>
            <Link
              href={`/admin/projects/${id}`}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              キャンセル
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-4 py-2 rounded-lg transition-colors ${
                saving 
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {saving ? "保存中..." : "保存"}
            </button>
          </>
        }
      />

      {error && (
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      <main className="h-[calc(100vh-140px)] max-w-6xl mx-auto px-6 py-6">
        <MarkdownEditor
          value={description}
          onChange={setDescription}
          className="h-full"
        />
      </main>

      {saving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="text-center">
              <div className="text-gray-600">説明を保存中...</div>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminAuth>
  );
}