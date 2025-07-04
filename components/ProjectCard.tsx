import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {project.mainImage && (
        <div className="relative w-full h-48">
          <Image
            src={project.mainImage}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 truncate">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 ml-2">
            {!project.isPublic && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                非公開
              </span>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {project.description.length > 100 
            ? `${project.description.substring(0, 100)}...` 
            : project.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>作成: {formatDate(project.createdAt)}</span>
          <span>更新: {formatDate(project.updatedAt)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                デモ
              </a>
            )}
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-700 text-sm font-medium"
              >
                GitHub
              </a>
            )}
          </div>
          
          <div className="flex gap-2">
            <Link
              href={`/projects/${project.id}`}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              詳細
            </Link>
            <Link
              href={`/projects/${project.id}/edit`}
              className="text-gray-600 hover:text-gray-700 text-sm font-medium"
            >
              編集
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}