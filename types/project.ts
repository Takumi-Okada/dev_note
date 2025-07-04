export interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  githubLink?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectInput {
  title: string;
  description?: string;
  url?: string;
  githubLink?: string;
  isPublic: boolean;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  id: string;
}