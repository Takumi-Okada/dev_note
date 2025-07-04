"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AdminAuthProps {
  children: React.ReactNode;
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // ローカルストレージから認証状態と期限をチェック
    const authStatus = localStorage.getItem("admin_authenticated");
    const authExpiry = localStorage.getItem("admin_auth_expiry");
    
    if (authStatus === "true" && authExpiry) {
      const expiryTime = parseInt(authExpiry);
      if (Date.now() < expiryTime) {
        setIsAuthenticated(true);
      } else {
        // 期限切れの場合は認証情報を削除
        localStorage.removeItem("admin_authenticated");
        localStorage.removeItem("admin_auth_expiry");
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // 1日後の期限を設定（24時間 = 24 * 60 * 60 * 1000ミリ秒）
        const expiry = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem("admin_authenticated", "true");
        localStorage.setItem("admin_auth_expiry", expiry.toString());
        setIsAuthenticated(true);
      } else {
        setError("パスワードが正しくありません");
      }
    } catch (error) {
      setError("認証に失敗しました");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("admin_auth_expiry");
    setIsAuthenticated(false);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">管理画面</h1>
            <p className="text-gray-600 mt-2">パスワードを入力してください</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="パスワードを入力"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              ログイン
            </button>
          </form>
          
          <div className="text-center mt-6">
            <button
              onClick={() => router.push("/")}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← ポートフォリオに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ログアウトボタンを右上に表示 */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          ログアウト
        </button>
      </div>
      {children}
    </div>
  );
}