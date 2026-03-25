'use client';

import { useRouter } from 'next/navigation';
import { Download, Upload, FileJson2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/store/editorStore';
import { downloadJson } from '@/lib/exportJson';
import { toast } from 'sonner';

export default function TopBar() {
  const { data, filename, setFilename, reset } = useEditorStore();
  const router = useRouter();

  const handleExport = () => {
    let finalName = filename;
    if (!finalName.toLowerCase().endsWith('.json')) {
      finalName += '.json';
    }
    downloadJson(data, finalName);
    toast.success(`Đã export "${finalName}"`);
  };

  const handleReset = () => {
    reset();
    router.push('/');
  };

  return (
    <header className="h-14 border-b border-white/10 bg-[#0d1510]/80 backdrop-blur-sm flex items-center gap-4 px-4 shrink-0">
      <button
        onClick={handleReset}
        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
      >
        <Upload className="w-4 h-4" />
        Upload mới
      </button>

      <div className="flex-1 flex items-center justify-center gap-2 group">
        <FileJson2 className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
        <input
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-teal-500/50 outline-none text-white/80 text-sm font-medium text-center w-48 focus:w-80 transition-all truncate"
          placeholder="Tên file..."
          spellCheck={false}
        />
        <span className="text-white/30 text-xs">· {data.length} nhân viên</span>
      </div>

      <Button
        onClick={handleExport}
        size="sm"
        className="bg-teal-600 hover:bg-teal-500 text-white gap-2"
      >
        <Download className="w-4 h-4" />
        Export JSON
      </Button>
    </header>
  );
}
