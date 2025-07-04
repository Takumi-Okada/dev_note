"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MarkdownEditor from "@/components/MarkdownEditor";

export default function EditorPage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState(""); 
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const initialContent = searchParams.get("content") || "";
    const initialTitle = searchParams.get("title") || "無題のプロジェクト";
    setContent(decodeURIComponent(initialContent));
    setTitle(decodeURIComponent(initialTitle));
  }, [searchParams]);

  const handleSave = () => {
    // 親ウィンドウに結果を送信
    if (window.opener) {
      window.opener.postMessage({
        type: "MARKDOWN_SAVED",
        content: content
      }, "*");
      window.close();
    } else {
      // 単独で開いた場合は前のページに戻る
      router.back();
    }
  };

  const handleCancel = () => {
    if (window.opener) {
      window.close();
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">マークダウンエディタ</h1>
            <p className="text-sm text-gray-600">{title}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </header>

      <main className="h-[calc(100vh-80px)]">
        <MarkdownEditor
          value={content}
          onChange={setContent}
        />
      </main>
    </div>
  );
}