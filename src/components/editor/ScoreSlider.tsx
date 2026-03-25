'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface ScoreSliderProps {
  value: number;
  onChange: (value: number) => void;
}

function scoreLabel(score: number) {
  if (score >= 2.0) return { text: 'Tốt', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
  if (score >= 1.0) return { text: 'Đạt', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
  return { text: 'Cần cải thiện', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
}

export default function ScoreSlider({ value, onChange }: ScoreSliderProps) {
  const [localValue, setLocalValue] = useState(value.toFixed(2));

  // Update local value when prop changes (from external sync)
  useEffect(() => {
    // Only update if not currently focused or if value is significantly different
    if (document.activeElement?.tagName !== 'INPUT') {
      setLocalValue(value.toFixed(2));
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    // Only allow numbers and one decimal point
    val = val.replace(/[^0-9.]/g, '');
    const segments = val.split('.');
    if (segments.length > 2) val = segments[0] + '.' + segments.slice(1).join('');
    
    setLocalValue(val);
    
    const num = parseFloat(val);
    if (!isNaN(num) && val !== '' && !val.endsWith('.')) {
      const clamped = Math.min(3, Math.max(0, num));
      onChange(clamped);
    }
  };

  const handleBlur = () => {
    const num = parseFloat(localValue);
    if (isNaN(num)) {
      setLocalValue(value.toFixed(2));
    } else {
      const clamped = Math.min(3, Math.max(0, num));
      setLocalValue(clamped.toFixed(2));
      onChange(clamped);
    }
  };

  const label = scoreLabel(value);

  return (
    <div className="flex items-stretch gap-6">
      <div className="relative group flex-1 max-w-[200px]">
        <Input
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputMode="decimal"
          className={cn(
            "h-28 !text-6xl font-black bg-[#0d1510] transition-all duration-300 border-2 text-center tabular-nums p-0",
            label.color,
            label.border,
            "focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50"
          )}
        />
        <div className="absolute -top-2.5 left-3 px-2 bg-[#0d1510] text-[10px] uppercase tracking-wider font-bold text-white/40 border border-white/10 rounded-full z-10">
          Nhập điểm
        </div>
      </div>
      
      <div className={cn(
        "flex-1 flex items-center justify-between p-5 rounded-xl border-2 transition-all duration-500",
        label.bg,
        label.border
      )}>
        <div className="flex items-center gap-4">
          <div className={cn("p-2.5 rounded-lg", label.bg)}>
            <Star className={cn("w-7 h-7 fill-current", label.color)} />
          </div>
          <div>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-0.5">Đánh giá chung</p>
            <p className={cn("text-4xl font-black leading-tight", label.color)}>{label.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

