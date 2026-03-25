export interface Course {
  name: string;
  instructor: string;
  duration: number; // số giờ, float
  link: string;
  description: string;
  group: string; // "Giá trị cốt lõi" | "Quản lý" | "Chuyên môn" | "Tương lai"
}

export interface CompetencyResult {
  competency_id: number; // 1–6
  score: number; // float, thường 0.0–3.0
  strengths: string[];
  limitations: string[];
  development_opportunities: string[];
  courses: Course[];
}

export interface Employee {
  email: string;
  manager_email: string;
  full_name: string;
  results: CompetencyResult[];
}

// JSON file = Employee[] (array)
export type JsonData = Employee[];

export type BulletField = 'strengths' | 'limitations' | 'development_opportunities';

export const COMPETENCY_NAMES: Record<number, string> = {
  1: 'Văn hóa & Lãnh đạo',
  2: 'Quản lý hiệu suất',
  3: 'Phát triển nhân sự',
  4: 'Phân tích thị trường',
  5: 'Quan hệ địa phương',
  6: 'Ứng dụng AI',
};

export const COURSE_GROUPS = ['Giá trị cốt lõi', 'Quản lý', 'Chuyên môn', 'Tương lai'];
