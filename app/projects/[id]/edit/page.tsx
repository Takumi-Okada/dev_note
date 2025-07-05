"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateProjectInput, Project } from "@/types/project";
import ProjectForm from "@/components/ProjectForm";
import { ProjectsAPI } from "@/lib/api/projects";

interface EditProjectProps {
  params: Promise<{ id: string }>;
}

export default function EditProject({ params }: EditProjectProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      } catch (err) {
        setError(err instanceof Error ? err.message : "プロジェクトの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmit = async (data: CreateProjectInput & { id?: string }) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const updatedProject = await ProjectsAPI.update({ ...data, id });
      
      // 更新成功後、詳細ページに遷移
      router.push(`/projects/${updatedProject.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "プロジェクトの更新に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("このプロジェクトを削除しますか？この操作は取り消せません。")) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      await ProjectsAPI.delete(id);
      
      // 削除成功後、一覧ページに遷移
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "プロジェクトの削除に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">プロジェクトが見つかりません</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="container mx-auto px-4 py-4 max-w-2xl">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        </div>
      )}
      
      <ProjectForm 
        mode="edit" 
        initialData={project}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        disabled={isSubmitting}
      />
      
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="text-center">
              <div className="text-gray-600">処理中...</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}