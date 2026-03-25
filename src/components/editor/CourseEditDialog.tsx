'use client';

import { useEffect, useState } from 'react';
import { Course, COURSE_GROUPS } from '@/types/schema';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CourseEditDialogProps {
  open: boolean;
  course: Course;
  onSave: (course: Course) => void;
  onClose: () => void;
}

export default function CourseEditDialog({ open, course, onSave, onClose }: CourseEditDialogProps) {
  const [form, setForm] = useState<Course>(course);
  const [errors, setErrors] = useState<Partial<Record<keyof Course, string>>>({});

  useEffect(() => {
    setForm(course);
    setErrors({});
  }, [course, open]);

  const set = (field: keyof Course, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = (): boolean => {
    const e: Partial<Record<keyof Course, string>> = {};
    if (!form.name.trim()) e.name = 'Tên khóa học là bắt buộc';
    if (!form.instructor.trim()) e.instructor = 'Giảng viên là bắt buộc';
    if (!form.duration || form.duration <= 0) e.duration = 'Thời lượng phải > 0';
    if (form.link && !form.link.startsWith('http')) e.link = 'Link phải bắt đầu bằng http';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (validate()) onSave({ ...form, duration: Number(form.duration) });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {course.name ? 'Chỉnh sửa khóa học' : 'Thêm khóa học'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs">Tên khóa học *</Label>
            <Input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500/50"
              placeholder="Nhập tên khóa học..."
            />
            {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
          </div>

          {/* Instructor */}
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs">Giảng viên *</Label>
            <Input
              value={form.instructor}
              onChange={(e) => set('instructor', e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-teal-500/50"
              placeholder="Tên giảng viên..."
            />
            {errors.instructor && <p className="text-red-400 text-xs">{errors.instructor}</p>}
          </div>

          {/* Duration + Group row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs">Thời lượng (giờ) *</Label>
              <Input
                type="number"
                min={0.5}
                step={0.5}
                value={form.duration}
                onChange={(e) => set('duration', parseFloat(e.target.value) || 0)}
                className="bg-white/5 border-white/10 text-white focus-visible:ring-blue-500/50"
              />
              {errors.duration && <p className="text-red-400 text-xs">{errors.duration}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs">Nhóm</Label>
              <select
                value={form.group}
                onChange={(e) => set('group', e.target.value)}
                className="w-full h-10 rounded-md bg-white/5 border border-white/10 text-white text-sm px-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              >
                {COURSE_GROUPS.map((g) => (
                  <option key={g} value={g} className="bg-slate-900">{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Link */}
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs">Link (tùy chọn)</Label>
            <Input
              value={form.link}
              onChange={(e) => set('link', e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500/50"
              placeholder="https://..."
            />
            {errors.link && <p className="text-red-400 text-xs">{errors.link}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs">Mô tả</Label>
            <Textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500/50 resize-none"
              placeholder="Mô tả ngắn về khóa học..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="text-white/50 hover:text-white hover:bg-white/10">
            Hủy
          </Button>
          <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-500 text-white">
            💾 Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
