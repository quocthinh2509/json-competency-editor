'use client';

import TopBar from '@/components/shared/TopBar';
import EmployeeSidebar from '@/components/editor/EmployeeSidebar';
import CompetencyTabs from '@/components/editor/CompetencyTabs';
import CompetencyPanel from '@/components/editor/CompetencyPanel';
import EmptyState from '@/components/shared/EmptyState';
import { useEditorStore } from '@/store/editorStore';

export default function EditorLayout() {
  const selectedEmployeeIndex = useEditorStore((s) => s.selectedEmployeeIndex);

  return (
    <div className="h-screen flex flex-col bg-[#0a0f0d] overflow-hidden">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <EmployeeSidebar />

        {/* Main panel */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {selectedEmployeeIndex !== null ? (
            <>
              <CompetencyTabs />
              <div className="flex-1 overflow-hidden">
                <CompetencyPanel />
              </div>
            </>
          ) : (
            <EmptyState />
          )}
        </main>
      </div>
    </div>
  );
}
