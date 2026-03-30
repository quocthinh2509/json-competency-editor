'use client';

import { useRef, useState } from 'react';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BulletItem from './BulletItem';

interface BulletListEditorProps {
  title: string;
  items: string[];
  onAdd: (text: string) => void;
  onUpdate: (index: number, text: string) => void;
  onDelete: (index: number) => void;
  accentColor?: string;
}

export default function BulletListEditor({
  title,
  items,
  onAdd,
  onUpdate,
  onDelete,
  accentColor = 'blue',
}: BulletListEditorProps) {
  const [open, setOpen] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState('');
  const addRef = useRef<HTMLTextAreaElement>(null);

  const startAdd = () => {
    setAdding(true);
    setTimeout(() => addRef.current?.focus(), 10);
  };

  const submitAdd = () => {
    const trimmed = newText.trim();
    if (trimmed) {
      onAdd(trimmed);
      setNewText('');
    }
    setAdding(false);
  };

  const cancelAdd = () => {
    setNewText('');
    setAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') cancelAdd();
    if (e.key === 'Enter') {
      if (e.ctrlKey || e.shiftKey) {
        // Ctrl+Enter or Shift+Enter: Manually insert newline
        e.preventDefault();
        const start = e.currentTarget.selectionStart;
        const end = e.currentTarget.selectionEnd;
        const val = e.currentTarget.value;
        setNewText(val.substring(0, start) + "\n" + val.substring(end));
        
        // Restore cursor position
        setTimeout(() => {
          if (addRef.current) {
            addRef.current.selectionStart = addRef.current.selectionEnd = start + 1;
          }
        }, 0);
      } else {
        // Enter: Submit
        e.preventDefault();
        submitAdd();
      }
    }
  };

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
        >
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          {title}
          <span className="text-white/30 font-normal">({items.length})</span>
        </button>
        <Button
          variant="ghost"
          size="sm"
          onClick={startAdd}
          className="h-7 px-2 text-white/40 hover:text-white hover:bg-white/10 text-xs gap-1"
        >
          <Plus className="w-3 h-3" />
          Thêm
        </Button>
      </div>

      {/* Body */}
      {open && (
        <div className="p-2 space-y-1">
          {items.map((item, idx) => (
            <BulletItem
              key={idx}
              text={item}
              onUpdate={(text) => onUpdate(idx, text)}
              onDelete={() => onDelete(idx)}
              accentColor={accentColor}
            />
          ))}

          {/* Add new textarea */}
          {adding && (
            <div className="flex items-start gap-2 p-2 rounded-lg bg-white/5 border border-white/20">
              <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2.5 shrink-0" />
              <textarea
                ref={addRef}
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onBlur={submitAdd}
                onKeyDown={handleKeyDown}
                placeholder="Nhập nội dung... (Enter để lưu, Ctrl+Enter để xuống dòng, Escape để hủy)"
                className="flex-1 bg-transparent text-white text-sm resize-none outline-none placeholder:text-white/30 min-h-[60px] leading-relaxed"
                rows={3}
              />
            </div>
          )}

          {items.length === 0 && !adding && (
            <p className="text-white/25 text-sm text-center py-3">Chưa có nội dung</p>
          )}
        </div>
      )}
    </div>
  );
}
