import { supabase } from '../supabase'
import { Project, CreateProjectInput, UpdateProjectInput } from '@/types/project'

export class ProjectsAPI {
  // プロジェクト一覧を取得
  static async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      throw new Error('プロジェクトの取得に失敗しました')
    }

    return data.map(this.transformFromDB)
  }

  // 公開プロジェクトのみを取得
  static async getPublic(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_public', true)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching public projects:', error)
      throw new Error('公開プロジェクトの取得に失敗しました')
    }

    return data.map(this.transformFromDB)
  }

  // IDでプロジェクトを取得
  static async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // プロジェクトが見つからない
      }
      console.error('Error fetching project:', error)
      throw new Error('プロジェクトの取得に失敗しました')
    }

    return this.transformFromDB(data)
  }

  // プロジェクトを作成
  static async create(input: CreateProjectInput): Promise<Project> {
    console.log('Creating project with input:', input)
    const dbInput = this.transformToDB(input)
    console.log('Transformed DB input:', dbInput)
    
    const { data, error } = await supabase
      .from('projects')
      .insert(dbInput)
      .select()
      .single()

    if (error) {
      console.error('Supabase error details:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      console.error('Error details:', error.details)
      throw new Error(`プロジェクトの作成に失敗しました: ${error.message}`)
    }

    console.log('Created project data:', data)
    return this.transformFromDB(data)
  }

  // プロジェクトを更新
  static async update(input: UpdateProjectInput): Promise<Project> {
    const { id, ...updateData } = input
    const dbInput = this.transformToDB(updateData)

    const { data, error } = await supabase
      .from('projects')
      .update(dbInput)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating project:', error)
      throw new Error('プロジェクトの更新に失敗しました')
    }

    return this.transformFromDB(data)
  }

  // プロジェクトを削除
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting project:', error)
      throw new Error('プロジェクトの削除に失敗しました')
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

  // アプリの形式からデータベースの形式に変換
  private static transformToDB(appData: Partial<CreateProjectInput>): Record<string, unknown> {
    const result: Record<string, unknown> = {
      title: appData.title,
      url: appData.url || null,
      github_link: appData.githubLink || null,
      is_public: appData.isPublic ?? true,
    };
    
    // descriptionが明示的に指定されている場合のみ含める
    if (appData.description !== undefined) {
      result.description = appData.description;
    }
    
    return result;
  }
}