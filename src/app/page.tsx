'use client';

import UploadZone from '@/components/upload/UploadZone';
import { FileJson2 } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0f0d] via-[#0d1510] to-[#071210] flex flex-col items-center justify-center p-8">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-700/25 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-800/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-teal-600/30 border border-teal-500/40 flex items-center justify-center">
              <FileJson2 className="w-6 h-6 text-teal-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            JSON Competency Editor
          </h1>
          <p className="text-white/50 text-base">
            Upload file JSON đánh giá năng lực nhân viên, chỉnh sửa và export
          </p>
        </div>

        {/* Upload Zone */}
        <UploadZone />

        {/* Footer note */}
        <p className="text-center text-white/25 text-xs">
          Dữ liệu chỉ lưu trong phiên làm việc — không gửi lên server
        </p>
      </div>
    </main>
  );
}
