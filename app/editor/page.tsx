"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditorPage() {
  const router = useRouter();

  useEffect(() => {
    // �;bk�����
    router.replace("/admin");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">�����-...</div>
    </div>
  );
}