'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEditorStore } from '@/store/editorStore';
import EmployeeCard from './EmployeeCard';

export default function EmployeeSidebar() {
  const { data, selectedEmployeeIndex, selectEmployee } = useEditorStore();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.map((emp, idx) => ({ emp, idx })).filter(({ emp }) =>
      emp.full_name.toLowerCase().includes(q) || emp.email.toLowerCase().includes(q)
    );
  }, [data, search]);

  return (
    <aside className="w-72 shrink-0 border-r border-white/10 flex flex-col bg-[#0d1510]/80">
      {/* Search */}
      <div className="p-3 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <Input
            placeholder="Tìm theo tên, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 bg-white/5 border-white/10 text-white placeholder:text-white/30 text-sm focus-visible:ring-teal-500/50"
          />
        </div>
      </div>

      {/* Employee count */}
      <div className="px-3 py-2 text-white/30 text-xs">
        {filtered.length} / {data.length} nhân viên
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1.5">
          {filtered.length === 0 ? (
            <p className="text-center text-white/30 text-sm py-8">Không tìm thấy</p>
          ) : (
            filtered.map(({ emp, idx }) => (
              <EmployeeCard
                key={emp.email}
                employee={emp}
                isActive={selectedEmployeeIndex === idx}
                onClick={() => selectEmployee(idx)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
