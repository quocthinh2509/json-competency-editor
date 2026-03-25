'use client';

import { useEditorStore } from '@/store/editorStore';
import { COMPETENCY_NAMES } from '@/types/schema';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import ScoreSlider from './ScoreSlider';
import BulletListEditor from './BulletListEditor';
import CourseTable from './CourseTable';

export default function CompetencyPanel() {
  const { data, selectedEmployeeIndex, activeCompetencyId, updateScore, addBullet, updateBullet, deleteBullet, addCourse, updateCourse, deleteCourse } = useEditorStore();

  if (selectedEmployeeIndex === null) return null;

  const employee = data[selectedEmployeeIndex];
  const result = employee.results.find((r) => r.competency_id === activeCompetencyId);

  if (!result) {
    return (
      <div className="flex items-center justify-center h-full text-white/30 text-sm">
        Không tìm thấy dữ liệu cho năng lực này
      </div>
    );
  }

  const empIdx = selectedEmployeeIndex;
  const compId = activeCompetencyId;

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6 max-w-3xl">
        {/* Header */}
        <div>
          <h2 className="text-lg font-semibold text-white">
            Năng lực {compId}: {COMPETENCY_NAMES[compId]}
          </h2>
          <p className="text-white/40 text-sm mt-0.5">{employee.full_name}</p>
        </div>

        {/* Score */}
        <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white/70 text-sm font-medium">Điểm số</h3>

          </div>
          <ScoreSlider
            value={result.score}
            onChange={(val) => updateScore(empIdx, compId, val)}
          />
        </div>

        <Separator className="bg-white/10" />

        {/* Bullet sections */}
        <div className="space-y-3">
          <BulletListEditor
            title="Điểm mạnh"
            items={result.strengths}
            onAdd={(text) => addBullet(empIdx, compId, 'strengths', text)}
            onUpdate={(idx, text) => updateBullet(empIdx, compId, 'strengths', idx, text)}
            onDelete={(idx) => deleteBullet(empIdx, compId, 'strengths', idx)}
            accentColor="green"
          />
          <BulletListEditor
            title="Hạn chế"
            items={result.limitations}
            onAdd={(text) => addBullet(empIdx, compId, 'limitations', text)}
            onUpdate={(idx, text) => updateBullet(empIdx, compId, 'limitations', idx, text)}
            onDelete={(idx) => deleteBullet(empIdx, compId, 'limitations', idx)}
            accentColor="red"
          />
          <BulletListEditor
            title="Cơ hội phát triển"
            items={result.development_opportunities}
            onAdd={(text) => addBullet(empIdx, compId, 'development_opportunities', text)}
            onUpdate={(idx, text) => updateBullet(empIdx, compId, 'development_opportunities', idx, text)}
            onDelete={(idx) => deleteBullet(empIdx, compId, 'development_opportunities', idx)}
            accentColor="amber"
          />
        </div>

        <Separator className="bg-white/10" />

        {/* Courses */}
        <div>
          <h3 className="text-white/70 text-sm font-medium mb-3">
            Khóa học đề xuất ({result.courses.length})
          </h3>
          <CourseTable
            courses={result.courses}
            onAdd={(c) => addCourse(empIdx, compId, c)}
            onUpdate={(idx, c) => updateCourse(empIdx, compId, idx, c)}
            onDelete={(idx) => deleteCourse(empIdx, compId, idx)}
          />
        </div>
      </div>
    </ScrollArea>
  );
}
