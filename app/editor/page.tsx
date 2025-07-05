"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditorPage() {
  const router = useRouter();

  useEffect(() => {
    // ¡;bkêÀ¤ì¯È
    router.replace("/admin");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">êÀ¤ì¯È-...</div>
    </div>
  );
}