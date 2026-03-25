import { Employee } from '@/types/schema';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { User, ChevronRight } from 'lucide-react';

interface EmployeeCardProps {
  employee: Employee;
  isActive: boolean;
  onClick: () => void;
}

function getAvgScore(employee: Employee): number {
  if (!employee.results.length) return 0;
  const sum = employee.results.reduce((acc, r) => acc + r.score, 0);
  return sum / employee.results.length;
}

function scoreColor(score: number): { badge: string; dot: string } {
  if (score >= 2.0) return { badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' };
  if (score >= 1.0) return { badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' };
  return { badge: 'bg-red-500/20 text-red-400 border-red-500/30', dot: 'bg-red-400' };
}

export default function EmployeeCard({ employee, isActive, onClick }: EmployeeCardProps) {
  const avg = getAvgScore(employee);
  const colors = scoreColor(avg);

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-3 rounded-xl border transition-all duration-150 group',
        isActive
          ? 'bg-teal-600/20 border-teal-500/50 shadow-md shadow-teal-900/30'
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
          isActive ? 'bg-teal-600/40' : 'bg-white/10'
        )}>
          <User className={cn('w-4 h-4', isActive ? 'text-teal-300' : 'text-white/50')} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={cn('font-medium text-sm truncate', isActive ? 'text-white' : 'text-white/80')}>
              {employee.full_name}
            </p>
            {isActive && <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', colors.dot)} />}
          </div>
          <p className="text-white/40 text-xs truncate">{employee.email}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge className={cn('text-xs px-1.5 py-0 border font-medium', colors.badge)}>
            {avg.toFixed(2)}
          </Badge>
          <span className="text-white/30 text-[10px]">{employee.results.length} NL</span>
        </div>
        <ChevronRight className={cn('w-3.5 h-3.5 shrink-0 transition-opacity', isActive ? 'text-teal-400 opacity-100' : 'text-white/20 opacity-0 group-hover:opacity-100')} />
      </div>
    </button>
  );
}
