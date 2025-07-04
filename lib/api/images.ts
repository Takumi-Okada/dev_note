import { createClient } from '@supabase/supabase-js';
import { ProjectImage, CreateProjectImageInput, ImageUploadResult } from '@/types/image';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export class ImageAPI {
  // 画像アップロード
  static async uploadImage(file: File, projectId: string): Promise<ImageUploadResult> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${projectId}/${Date.now()}.${fileExt}`;
      const filePath = `project-images/${fileName}`;

      // ファイルをStorageにアップロード
      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return { success: false, error: uploadError.message };
      }

      // 画像情報をDBに保存
      const imageData: CreateProjectImageInput = {
        projectId,
        fileName: file.name,
        filePath,
        fileSize: file.size,
        mimeType: file.type,
        displayOrder: 0
      };

      const { data, error } = await supabase
        .from('project_images')
        .insert([this.transformToDatabase(imageData)])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        // アップロードした画像を削除
        await supabase.storage
          .from('project-images')
          .remove([fileName]);
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        image: this.transformFromDatabase(data)
      };
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, error: 'アップロードに失敗しました' };
    }
  }

  // プロジェクトの画像一覧取得
  static async getProjectImages(projectId: string): Promise<ProjectImage[]> {
    try {
      const { data, error } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', projectId)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Get images error:', error);
        return [];
      }

      return data.map(this.transformFromDatabase);
    } catch (error) {
      console.error('Get images error:', error);
      return [];
    }
  }

  // 画像削除
  static async deleteImage(imageId: string): Promise<boolean> {
    try {
      // 画像情報を取得
      const { data: imageData, error: getError } = await supabase
        .from('project_images')
        .select('*')
        .eq('id', imageId)
        .single();

      if (getError || !imageData) {
        console.error('Get image error:', getError);
        return false;
      }

      // Storageから画像を削除
      const fileName = imageData.file_path.replace('project-images/', '');
      const { error: deleteError } = await supabase.storage
        .from('project-images')
        .remove([fileName]);

      if (deleteError) {
        console.error('Storage delete error:', deleteError);
      }

      // DBから画像情報を削除
      const { error: dbError } = await supabase
        .from('project_images')
        .delete()
        .eq('id', imageId);

      if (dbError) {
        console.error('DB delete error:', dbError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Delete image error:', error);
      return false;
    }
  }

  // 画像順序更新
  static async updateImageOrder(imageId: string, displayOrder: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('project_images')
        .update({ display_order: displayOrder })
        .eq('id', imageId);

      if (error) {
        console.error('Update order error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Update order error:', error);
      return false;
    }
  }

  // 画像の公開URLを取得
  static getImageUrl(filePath: string): string {
    const fileName = filePath.replace('project-images/', '');
    const { data } = supabase.storage
      .from('project-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  // データベース形式への変換
  private static transformToDatabase(image: CreateProjectImageInput): Record<string, unknown> {
    return {
      project_id: image.projectId,
      file_name: image.fileName,
      file_path: image.filePath,
      file_size: image.fileSize,
      mime_type: image.mimeType,
      display_order: image.displayOrder || 0
    };
  }

  // アプリケーション形式への変換
  private static transformFromDatabase(data: Record<string, unknown>): ProjectImage {
    return {
      id: data.id as string,
      projectId: data.project_id as string,
      fileName: data.file_name as string,
      filePath: data.file_path as string,
      fileSize: data.file_size as number,
      mimeType: data.mime_type as string,
      displayOrder: data.display_order as number,
      createdAt: new Date(data.created_at as string),
      updatedAt: new Date(data.updated_at as string)
    };
  }
}