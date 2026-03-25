'use client';

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useEditorStore } from '@/store/editorStore';
import { COMPETENCY_NAMES } from '@/types/schema';
import { cn } from '@/lib/utils';

function scoreColor(score: number) {
  if (score >= 2.0) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  if (score >= 1.0) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  return 'bg-red-500/20 text-red-400 border-red-500/30';
}

export default function CompetencyTabs() {
  const { data, selectedEmployeeIndex, activeCompetencyId, setActiveCompetency } = useEditorStore();

  const employee = selectedEmployeeIndex !== null ? data[selectedEmployeeIndex] : null;

  const getScore = (compId: number) => {
    const r = employee?.results.find((r) => r.competency_id === compId);
    return r?.score ?? null;
  };

  return (
    <div className="flex gap-1 border-b border-white/10 px-4 bg-[#0d1510]/50 shrink-0">
      {[1, 2, 3, 4, 5, 6].map((id) => {
        const score = getScore(id);
        const isActive = activeCompetencyId === id;

        return (
          <Tooltip key={id}>
            <TooltipTrigger
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2.5 border-b-2 transition-all text-sm font-medium cursor-pointer bg-transparent',
                isActive
                  ? 'border-teal-500 text-teal-400'
                  : 'border-transparent text-white/40 hover:text-white/70 hover:border-white/20'
              )}
              onClick={() => setActiveCompetency(id)}
            >
              <span>C{id}</span>
              {score !== null && (
                <Badge className={cn('text-[10px] px-1 py-0 border h-4', scoreColor(score))}>
                  {score.toFixed(1)}
                </Badge>
              )}
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-slate-800 border-white/10 text-white text-xs">
              {COMPETENCY_NAMES[id]}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
