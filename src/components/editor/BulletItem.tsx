'use client';

import { useRef, useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BulletItemProps {
  text: string;
  onUpdate: (text: string) => void;
  onDelete: () => void;
  accentColor?: string;
}

export default function BulletItem({ text, onUpdate, onDelete, accentColor = 'blue' }: BulletItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const startEdit = () => {
    setDraft(text);
    setEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    }, 10);
  };

  const save = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== text) onUpdate(trimmed);
    else setDraft(text);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(text);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') cancel();
    if (e.key === 'Enter') {
      if (e.ctrlKey || e.shiftKey) {
        // Ctrl+Enter or Shift+Enter: Manually insert newline
        e.preventDefault();
        const start = e.currentTarget.selectionStart;
        const end = e.currentTarget.selectionEnd;
        const val = e.currentTarget.value;
        setDraft(val.substring(0, start) + "\n" + val.substring(end));
        
        // Restore cursor position
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1;
          }
        }, 0);
      } else {
        // Enter: Save
        e.preventDefault();
        save();
      }
    }
  };

  const dotColor: Record<string, string> = {
    green: 'bg-emerald-400',
    red: 'bg-red-400',
    amber: 'bg-amber-400',
    blue: 'bg-blue-400',
  };

  if (editing) {
    return (
      <div className="flex items-start gap-2 p-2 rounded-lg bg-white/5 border border-white/15">
        <div className={cn('w-1.5 h-1.5 rounded-full mt-2.5 shrink-0', dotColor[accentColor] ?? dotColor.blue)} />
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập nội dung... (Enter để lưu, Ctrl+Enter để xuống dòng, Escape để hủy)"
          className="flex-1 bg-transparent text-white text-sm resize-none outline-none min-h-[60px] leading-relaxed"
          rows={3}
        />
        <div className="flex gap-1 shrink-0">
          <button onClick={save} className="p-1 rounded text-emerald-400 hover:bg-emerald-400/20 transition-colors">
            <Check className="w-3.5 h-3.5" />
          </button>
          <button onClick={cancel} className="p-1 rounded text-white/40 hover:bg-white/10 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors">
      <div className={cn('w-1.5 h-1.5 rounded-full mt-2 shrink-0', dotColor[accentColor] ?? dotColor.blue)} />
      <p
        className="flex-1 text-white/80 text-sm leading-relaxed cursor-text"
        onClick={startEdit}
      >
        {text}
      </p>
      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={startEdit} className="p-1 rounded text-white/40 hover:text-blue-400 hover:bg-blue-400/10 transition-colors">
          <Pencil className="w-3 h-3" />
        </button>
        <button onClick={onDelete} className="p-1 rounded text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
