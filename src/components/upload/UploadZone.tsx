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

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const jsonFiles = fileArray.filter(f => f.name.endsWith('.json'));
      
      if (jsonFiles.length === 0) {
        toast.error('Chỉ hỗ trợ file .json');
        return;
      }

      setLoading(true);
      try {
        let allData: any[] = [];
        for (const file of jsonFiles) {
          const data = await parseAndValidate(file);
          allData = [...allData, ...data];
        }
        
        loadData(allData, jsonFiles[0].name);
        toast.success(`Đã tải ${jsonFiles.length} file — Tổng ${allData.length} nhân viên`);
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
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
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
        multiple
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
}
