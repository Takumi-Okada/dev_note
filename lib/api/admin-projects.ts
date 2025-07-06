import { Project, CreateProjectInput, UpdateProjectInput } from '@/types/project'

export class AdminProjectsAPI {
  private static getAuthHeaders(): HeadersInit {
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    const authExpiry = localStorage.getItem('admin_auth_expiry');
    const password = localStorage.getItem('admin_password');
    
    if (!isAuthenticated || isAuthenticated !== 'true') {
      throw new Error('認証が必要です');
    }
    
    if (authExpiry && Date.now() >= parseInt(authExpiry)) {
      throw new Error('認証が期限切れです');
    }
    
    if (!password) {
      throw new Error('認証情報が見つかりません');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${password}`
    };
  }

  // プロジェクト一覧を取得（管理者用 - 全てのプロジェクト）
  static async getAll(): Promise<Project[]> {
    try {
      const response = await fetch('/api/admin/projects', {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('認証が無効です');
        }
        throw new Error('プロジェクトの取得に失敗しました');
      }

      const data = await response.json();
      return data.map(this.transformFromDB);
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  // IDでプロジェクトを取得（管理者用）
  static async getById(id: string): Promise<Project | null> {
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('認証が無効です');
        }
        if (response.status === 404) {
          return null;
        }
        throw new Error('プロジェクトの取得に失敗しました');
      }

      const data = await response.json();
      return this.transformFromDB(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  }

  // プロジェクトを作成
  static async create(input: CreateProjectInput): Promise<Project> {
    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('認証が無効です');
        }
        throw new Error('プロジェクトの作成に失敗しました');
      }

      const data = await response.json();
      return this.transformFromDB(data);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  // プロジェクトを更新
  static async update(input: UpdateProjectInput): Promise<Project> {
    try {
      const { id, ...updateData } = input;
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('認証が無効です');
        }
        throw new Error('プロジェクトの更新に失敗しました');
      }

      const data = await response.json();
      return this.transformFromDB(data);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  // プロジェクトを削除
  static async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('認証が無効です');
        }
        throw new Error('プロジェクトの削除に失敗しました');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  // データベースの形式からアプリの形式に変換
  private static transformFromDB(dbData: Record<string, unknown>): Project {
    return {
      id: dbData.id as string,
      title: dbData.title as string,
      description: dbData.description as string,
      url: dbData.url as string || undefined,
      githubLink: dbData.github_link as string || undefined,
      isPublic: dbData.is_public as boolean,
      createdAt: new Date(dbData.created_at as string),
      updatedAt: new Date(dbData.updated_at as string),
    }
  }
}