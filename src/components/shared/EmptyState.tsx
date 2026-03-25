import { Users } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-white/30">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
        <Users className="w-8 h-8" />
      </div>
      <div className="text-center">
        <p className="font-medium text-white/40">Chưa chọn nhân viên</p>
        <p className="text-sm mt-1">Chọn một nhân viên từ danh sách bên trái</p>
      </div>
    </div>
  );
}
