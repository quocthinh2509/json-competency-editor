'use client';

import { useState } from 'react';
import { Course } from '@/types/schema';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, ExternalLink, BookOpen, Clock, Tag, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import CourseEditDialog from './CourseEditDialog';

interface CourseTableProps {
  courses: Course[];
  onAdd: (course: Course) => void;
  onUpdate: (idx: number, course: Course) => void;
  onDelete: (idx: number) => void;
}

const groupColors: Record<string, string> = {
  'Giá trị cốt lõi': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  'Quản lý': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Chuyên môn': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Tương lai': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

export default function CourseTable({ courses, onAdd, onUpdate, onDelete }: CourseTableProps) {
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const emptyCourse: Course = { name: '', instructor: '', duration: 1, link: '', description: '', group: 'Giá trị cốt lõi' };

  return (
    <div className="space-y-2">
      {courses.map((course, idx) => (
        <div
          key={idx}
          className="group rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/8 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4 text-violet-400" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-medium text-sm leading-snug">{course.name}</p>
                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1.5">
                  <span className="flex items-center gap-1 text-white/50 text-xs">
                    <User className="w-3 h-3" /> {course.instructor}
                  </span>
                  <span className="flex items-center gap-1 text-white/50 text-xs">
                    <Clock className="w-3 h-3" /> {course.duration}h
                  </span>
                  <Badge className={cn('text-[10px] px-1.5 py-0 border h-4', groupColors[course.group] ?? 'bg-white/10 text-white/50 border-white/10')}>
                    <Tag className="w-2.5 h-2.5 mr-0.5" /> {course.group}
                  </Badge>
                </div>
                {course.link && (
                  <a
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-blue-400 text-xs mt-1.5 hover:underline truncate"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate">{course.link}</span>
                  </a>
                )}
                {course.description && (
                  <p className="text-white/40 text-xs mt-1.5 line-clamp-2">{course.description}</p>
                )}
              </div>
            </div>
            <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditIdx(idx)}
                className="p-1.5 rounded-lg text-white/40 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(idx)}
                className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {courses.length === 0 && (
        <p className="text-white/25 text-sm text-center py-4">Chưa có khóa học nào</p>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => setAddOpen(true)}
        className="w-full border-dashed border-white/20 text-white/40 hover:text-white hover:border-white/40 bg-transparent text-xs gap-2"
      >
        + Thêm khóa học
      </Button>

      {/* Edit dialog */}
      {editIdx !== null && (
        <CourseEditDialog
          open
          course={courses[editIdx]}
          onSave={(c) => { onUpdate(editIdx, c); setEditIdx(null); }}
          onClose={() => setEditIdx(null)}
        />
      )}
      {/* Add dialog */}
      <CourseEditDialog
        open={addOpen}
        course={emptyCourse}
        onSave={(c) => { onAdd(c); setAddOpen(false); }}
        onClose={() => setAddOpen(false)}
      />
    </div>
  );
}
