"use client";

import { useRef } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function MarkdownEditor({ value, onChange, className = "" }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.slice(start, end);
    const newText = before + selectedText + after;
    const newValue = value.slice(0, start) + newText + value.slice(end);
    
    onChange(newValue);
    
    setTimeout(() => {
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selectedText.length;
      textarea.focus();
    }, 0);
  };

  return (
    <div className={`h-full flex ${className}`}>
      {/* エディタ部分 */}
      <div className="w-1/2 flex flex-col border-r border-gray-200">
        {/* ツールバー */}
        <div className="bg-white border-b border-gray-200 p-3 flex flex-wrap gap-2">
          <button
            onClick={() => insertMarkdown("**", "**")}
            className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            title="太字"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => insertMarkdown("*", "*")}
            className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded italic"
            title="斜体"
          >
            I
          </button>
          <button
            onClick={() => insertMarkdown("`", "`")}
            className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded font-mono"
            title="インラインコード"
          >
            `
          </button>
          <button
            onClick={() => insertMarkdown("```\n", "\n```")}
            className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            title="コードブロック"
          >
            ```
          </button>
          <button
            onClick={() => insertMarkdown("## ")}
            className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            title="見出し"
          >
            H2
          </button>
          <button
            onClick={() => insertMarkdown("- ")}
            className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            title="リスト"
          >
            •
          </button>
          <button
            onClick={() => insertMarkdown("[", "](url)")}
            className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            title="リンク"
          >
            🔗
          </button>
        </div>

        {/* テキストエリア */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full p-4 border-none resize-none focus:outline-none font-mono text-sm leading-relaxed"
            placeholder="マークダウンを入力してください..."
            spellCheck={false}
          />
        </div>
      </div>

      {/* プレビュー部分 */}
      <div className="w-1/2 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-3">
          <h3 className="text-sm font-medium text-gray-700">プレビュー</h3>
        </div>
        <div className="flex-1 overflow-auto bg-white p-4">
          {value ? (
            <MarkdownRenderer content={value} />
          ) : (
            <div className="text-gray-400 text-center mt-8">
              プレビューがここに表示されます
            </div>
          )}
        </div>
      </div>
    </div>
  );
}