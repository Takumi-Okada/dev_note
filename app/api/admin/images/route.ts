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

export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const projectId = formData.get("projectId") as string;

    if (!file || !projectId) {
      return NextResponse.json(
        { error: "File and projectId are required" },
        { status: 400 }
      );
    }

    // ファイルをSupabase Storageにアップロード
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `projects/${projectId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // データベースに画像情報を保存
    const { data: image, error: dbError } = await supabase
      .from("project_images")
      .insert({
        project_id: projectId,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        display_order: 0,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { imageIds } = await request.json();

    if (!Array.isArray(imageIds)) {
      return NextResponse.json(
        { error: "imageIds must be an array" },
        { status: 400 }
      );
    }

    // バッチで表示順序を更新
    const updates = imageIds.map((id, index) =>
      supabase
        .from("project_images")
        .update({ display_order: index })
        .eq("id", id)
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating image order:", error);
    return NextResponse.json(
      { error: "Failed to update image order" },
      { status: 500 }
    );
  }
}