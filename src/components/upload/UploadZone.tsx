'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Upload, FileJson } from 'lucide-react';
import { parseAndValidate } from '@/lib/parseJson';
import { useEditorStore } from '@/store/editorStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function UploadZone() {
  const router = useRouter();
  const loadData = useEditorStore((s) => s.loadData);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith('.json')) {
        toast.error('Chỉ hỗ trợ file .json');
        return;
      }
      setLoading(true);
      try {
        const data = await parseAndValidate(file);
        loadData(data, file.name);
        toast.success(`Đã tải "${file.name}" — ${data.length} nhân viên`);
        router.push('/editor');
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [loadData, router]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        'border-2 border-dashed rounded-2xl p-16 flex flex-col items-center gap-6 transition-all duration-200 cursor-pointer select-none',
        dragging
          ? 'border-teal-500 bg-teal-500/10 scale-[1.01]'
          : 'border-white/20 bg-white/5 hover:border-teal-400/60 hover:bg-white/10'
      )}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <div className={cn(
        'w-20 h-20 rounded-2xl flex items-center justify-center transition-all',
        dragging ? 'bg-teal-500/30' : 'bg-white/10'
      )}>
        {loading ? (
          <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <FileJson className={cn('w-10 h-10', dragging ? 'text-teal-400' : 'text-white/60')} />
        )}
      </div>

      <div className="text-center space-y-2">
        <p className="text-xl font-semibold text-white">
          {loading ? 'Đang xử lý...' : 'Kéo thả file JSON vào đây'}
        </p>
        <p className="text-white/50 text-sm">hoặc</p>
        <Button
          variant="outline"
          className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white bg-transparent"
          disabled={loading}
          onClick={(e) => { e.stopPropagation(); document.getElementById('file-input')?.click(); }}
        >
          <Upload className="w-4 h-4 mr-2" />
          Chọn file từ máy
        </Button>
      </div>

      <p className="text-white/30 text-xs">Chỉ hỗ trợ file .json · Tối đa 10MB</p>

      <input
        id="file-input"
        type="file"
        accept=".json"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
}
