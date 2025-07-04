-- プロジェクト管理システム - データベーススキーマ
-- 作成日: 2025年

-- ===============================================
-- 1. プロジェクトテーブル
-- ===============================================

-- プロジェクトテーブルの作成
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  url VARCHAR(500),
  github_link VARCHAR(500),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- main_imageカラムが存在する場合は削除（過去の移行用）
ALTER TABLE projects DROP COLUMN IF EXISTS main_image;

-- RLS（Row Level Security）を有効化
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 古いポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON projects;

-- 全てのプロジェクトを読み取り可能（認証なしでも）
DROP POLICY IF EXISTS "Anyone can view projects" ON projects;
CREATE POLICY "Anyone can view projects" ON projects
  FOR SELECT USING (true);

-- 全てのプロジェクトを挿入・更新・削除可能（認証なしでも）
DROP POLICY IF EXISTS "Anyone can insert projects" ON projects;
CREATE POLICY "Anyone can insert projects" ON projects
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update projects" ON projects;
CREATE POLICY "Anyone can update projects" ON projects
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete projects" ON projects;
CREATE POLICY "Anyone can delete projects" ON projects
  FOR DELETE USING (true);

-- ===============================================
-- 2. プロジェクト画像テーブル
-- ===============================================

-- プロジェクト画像テーブル
CREATE TABLE IF NOT EXISTS project_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_display_order ON project_images(project_id, display_order);

-- RLSポリシー設定
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- 全てのユーザーがCRUD操作可能（認証なし）
DROP POLICY IF EXISTS "Anyone can view project images" ON project_images;
CREATE POLICY "Anyone can view project images"
ON project_images FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Anyone can insert project images" ON project_images;
CREATE POLICY "Anyone can insert project images"
ON project_images FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update project images" ON project_images;
CREATE POLICY "Anyone can update project images"
ON project_images FOR UPDATE
TO public
USING (true);

DROP POLICY IF EXISTS "Anyone can delete project images" ON project_images;
CREATE POLICY "Anyone can delete project images"
ON project_images FOR DELETE
TO public
USING (true);

-- ===============================================
-- 3. 共通関数とトリガー
-- ===============================================

-- updated_atを自動更新する関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- プロジェクトテーブルのupdated_atを自動更新するトリガー
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- プロジェクト画像テーブルのupdated_atを自動更新するトリガー
DROP TRIGGER IF EXISTS update_project_images_updated_at ON project_images;
CREATE TRIGGER update_project_images_updated_at
    BEFORE UPDATE ON project_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- 4. 初期データ（必要に応じて）
-- ===============================================

-- テストデータの挿入（開発環境用 - 必要に応じてコメントアウト）
-- INSERT INTO projects (title, description, url, github_link, is_public) VALUES
-- ('サンプルプロジェクト', 'これはサンプルのプロジェクトです。', 'https://example.com', 'https://github.com/user/repo', true);