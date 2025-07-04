"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateProjectInput } from "@/types/project";
import ProjectForm from "@/components/ProjectForm";
import { ProjectsAPI } from "@/lib/api/projects";

export default function NewProject() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (data: CreateProjectInput) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const newProject = await ProjectsAPI.create(data);
      
      // 作成成功後、詳細ページに遷移
      router.push(`/projects/${newProject.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "プロジェクトの作成に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        mode="create" 
        onSubmit={handleSubmit}
        disabled={isSubmitting}
      />
      
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="text-center">
              <div className="text-gray-600">プロジェクトを作成中...</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}