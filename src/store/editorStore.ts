import { create } from 'zustand';
import { JsonData, Employee, CompetencyResult, Course, BulletField } from '@/types/schema';

interface EditorState {
  data: JsonData;
  selectedEmployeeIndex: number | null;
  activeCompetencyId: number;
  filename: string;

  // Actions - load
  loadData: (data: JsonData, filename: string) => void;

  // Actions - navigation
  selectEmployee: (index: number) => void;
  setActiveCompetency: (id: number) => void;

  // Actions - competency
  updateScore: (employeeIdx: number, competencyId: number, score: number) => void;

  // Actions - bullet lists
  addBullet: (employeeIdx: number, competencyId: number, field: BulletField, text: string) => void;
  updateBullet: (employeeIdx: number, competencyId: number, field: BulletField, bulletIdx: number, text: string) => void;
  deleteBullet: (employeeIdx: number, competencyId: number, field: BulletField, bulletIdx: number) => void;

  // Actions - courses
  addCourse: (employeeIdx: number, competencyId: number, course: Course) => void;
  updateCourse: (employeeIdx: number, competencyId: number, courseIdx: number, course: Course) => void;
  deleteCourse: (employeeIdx: number, competencyId: number, courseIdx: number) => void;
  // Actions - append
  appendData: (newData: JsonData) => void;
  setFilename: (filename: string) => void;


  // Reset
  reset: () => void;
}

function findCompIdx(data: JsonData, empIdx: number, compId: number): number {
  return data[empIdx].results.findIndex((r) => r.competency_id === compId);
}

export const useEditorStore = create<EditorState>((set) => ({
  data: [],
  selectedEmployeeIndex: null,
  activeCompetencyId: 1,
  filename: 'data.json',

  loadData: (data, filename) =>
    set({ data, filename, selectedEmployeeIndex: null, activeCompetencyId: 1 }),

  selectEmployee: (index) => set({ selectedEmployeeIndex: index, activeCompetencyId: 1 }),

  setActiveCompetency: (id) => set({ activeCompetencyId: id }),

  updateScore: (employeeIdx, competencyId, score) =>
    set((state) => {
      const newData = structuredClone(state.data) as JsonData;
      const ci = findCompIdx(newData, employeeIdx, competencyId);
      if (ci !== -1) newData[employeeIdx].results[ci].score = score;
      return { data: newData };
    }),

  addBullet: (employeeIdx, competencyId, field, text) =>
    set((state) => {
      const newData = structuredClone(state.data) as JsonData;
      const ci = findCompIdx(newData, employeeIdx, competencyId);
      if (ci !== -1) newData[employeeIdx].results[ci][field].push(text);
      return { data: newData };
    }),

  updateBullet: (employeeIdx, competencyId, field, bulletIdx, text) =>
    set((state) => {
      const newData = structuredClone(state.data) as JsonData;
      const ci = findCompIdx(newData, employeeIdx, competencyId);
      if (ci !== -1) newData[employeeIdx].results[ci][field][bulletIdx] = text;
      return { data: newData };
    }),

  deleteBullet: (employeeIdx, competencyId, field, bulletIdx) =>
    set((state) => {
      const newData = structuredClone(state.data) as JsonData;
      const ci = findCompIdx(newData, employeeIdx, competencyId);
      if (ci !== -1) newData[employeeIdx].results[ci][field].splice(bulletIdx, 1);
      return { data: newData };
    }),

  addCourse: (employeeIdx, competencyId, course) =>
    set((state) => {
      const newData = structuredClone(state.data) as JsonData;
      const ci = findCompIdx(newData, employeeIdx, competencyId);
      if (ci !== -1) newData[employeeIdx].results[ci].courses.push(course);
      return { data: newData };
    }),

  updateCourse: (employeeIdx, competencyId, courseIdx, course) =>
    set((state) => {
      const newData = structuredClone(state.data) as JsonData;
      const ci = findCompIdx(newData, employeeIdx, competencyId);
      if (ci !== -1) newData[employeeIdx].results[ci].courses[courseIdx] = course;
      return { data: newData };
    }),

  deleteCourse: (employeeIdx, competencyId, courseIdx) =>
    set((state) => {
      const newData = structuredClone(state.data) as JsonData;
      const ci = findCompIdx(newData, employeeIdx, competencyId);
      if (ci !== -1) newData[employeeIdx].results[ci].courses.splice(courseIdx, 1);
      return { data: newData };
    }),

  appendData: (newData) =>
    set((state) => ({ data: [...state.data, ...newData] })),

  setFilename: (filename) => set({ filename }),

  reset: () =>
    set({ data: [], selectedEmployeeIndex: null, activeCompetencyId: 1, filename: 'data.json' }),
}));
