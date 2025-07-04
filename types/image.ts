export interface ProjectImage {
  id: string;
  projectId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectImageInput {
  projectId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  displayOrder?: number;
}

export interface UpdateProjectImageInput {
  displayOrder?: number;
}

export interface ImageUploadResult {
  success: boolean;
  image?: ProjectImage;
  error?: string;
}