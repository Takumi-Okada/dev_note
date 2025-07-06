import { ProjectImage } from '@/types/image'

export class AdminImagesAPI {
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
      'Authorization': `Bearer ${password}`
    };
  }

  // 画像をアップロード
  static async uploadImage(projectId: string, file: File): Promise<ProjectImage> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId);

      const response = await fetch('/api/admin/images', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('認証が無効です');
        }
        throw new Error('画像のアップロードに失敗しました');
      }

      const data = await response.json();
      return this.transformFromDB(data);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // 画像を削除
  static async deleteImage(imageId: string): Promise<void> {
    try {
      const response = await fetch(`/api/admin/images/${imageId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('認証が無効です');
        }
        throw new Error('画像の削除に失敗しました');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  // 画像の表示順序を更新
  static async updateImageOrder(imageIds: string[]): Promise<void> {
    try {
      const response = await fetch('/api/admin/images', {
        method: 'PUT',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageIds }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('認証が無効です');
        }
        throw new Error('画像順序の更新に失敗しました');
      }
    } catch (error) {
      console.error('Error updating image order:', error);
      throw error;
    }
  }

  // データベースの形式からアプリの形式に変換
  private static transformFromDB(dbData: Record<string, unknown>): ProjectImage {
    return {
      id: dbData.id as string,
      projectId: dbData.project_id as string,
      fileName: dbData.file_name as string,
      filePath: dbData.file_path as string,
      fileSize: dbData.file_size as number,
      mimeType: dbData.mime_type as string,
      displayOrder: dbData.display_order as number,
      createdAt: new Date(dbData.created_at as string),
      updatedAt: new Date(dbData.updated_at as string),
    }
  }
}