"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CreateProjectInput, UpdateProjectInput, Project } from "@/types/project";
import Header from "./Header";

interface ProjectFormProps {
  mode: "create" | "edit";
  initialData?: Project;
  onSubmit: (data: any) => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export default function ProjectForm({ mode, initialData, onSubmit, onDelete, disabled = false }: ProjectFormProps) {
  const [formData, setFormData] = useState<CreateProjectInput>({
    title: "",
    url: "",
    githubLink: "",
    isPublic: true,
  });


  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        title: initialData.title,
        url: initialData.url || "",
        githubLink: initialData.githubLink || "",
        isPublic: initialData.isPublic,
      });
    }
  }, [mode, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "edit" && initialData) {
      onSubmit({ ...formData, id: initialData.id });
    } else {
      onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={mode === "create" ? "新規プロジェクト作成" : "プロジェクトを編集"}
        showBackButton={true}
        backLabel="← プロジェクト一覧"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            タイトル *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="プロジェクト名を入力"
          />
        </div>



        <div>
          <label htmlFor="url" className="block text-sm font-medium mb-2">
            URL
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label htmlFor="githubLink" className="block text-sm font-medium mb-2">
            GitHubリンク
          </label>
          <input
            type="url"
            id="githubLink"
            name="githubLink"
            value={formData.githubLink}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://github.com/username/repository"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublic" className="ml-2 text-sm font-medium">
            公開する
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={disabled}
            className={`px-6 py-2 rounded-lg transition-colors ${
              disabled 
                ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {disabled 
              ? (mode === "create" ? "作成中..." : "更新中...")
              : (mode === "create" ? "作成" : "更新")
            }
          </button>
          <Link
            href="/"
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            キャンセル
          </Link>
          {mode === "edit" && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors ml-auto"
            >
              削除
            </button>
          )}
        </div>
      </form>
      </div>
    </div>
  );
}