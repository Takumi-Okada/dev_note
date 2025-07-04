import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
}

export default function Header({ 
  title = "個人開発記録",
  showBackButton = false,
  backHref = "/",
  backLabel = "← 戻る",
  actions 
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* アイコンとタイトル */}
            <div className="flex items-center gap-3">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Image 
                  src="/icon.png" 
                  alt="アプリアイコン" 
                  width={48} 
                  height={48}
                  className="rounded"
                />
              </Link>
              {title !== "個人開発記録" && (
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              )}
            </div>
            
            {/* 戻るボタン */}
            {showBackButton && (
              <Link 
                href={backHref}
                className="text-blue-500 hover:text-blue-600 transition-colors text-sm ml-4"
              >
                {backLabel}
              </Link>
            )}
          </div>

          {/* アクションボタン */}
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}