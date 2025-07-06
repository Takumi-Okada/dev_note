import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedPassword = process.env.ADMIN_PASSWORD;
  
  if (!authHeader || !expectedPassword) {
    return false;
  }
  
  const token = authHeader.replace("Bearer ", "");
  return token === expectedPassword;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // 画像情報を取得
    const { data: image, error: fetchError } = await supabase
      .from("project_images")
      .select("file_path")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // Storageから画像ファイルを削除
    const { error: deleteError } = await supabase.storage
      .from("project-images")
      .remove([image.file_path]);

    if (deleteError) throw deleteError;

    // データベースから画像レコードを削除
    const { error: dbError } = await supabase
      .from("project_images")
      .delete()
      .eq("id", id);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}