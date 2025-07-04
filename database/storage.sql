-- Supabase Storage設定
-- プロジェクト画像用のストレージバケット作成

-- 1. バケット作成
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- 2. バケットのRLSポリシー設定
-- 一時的に全てのユーザーがアップロード・更新・削除可能（認証なし）
CREATE POLICY "Anyone can upload project images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Anyone can update project images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'project-images');

CREATE POLICY "Anyone can delete project images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'project-images');

-- 3. 公開読み取り許可
CREATE POLICY "Anyone can view project images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');