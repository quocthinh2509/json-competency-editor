import { JsonData } from '@/types/schema';

export async function parseAndValidate(file: File): Promise<JsonData> {
  // 1. Kiểm tra kích thước
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File quá lớn (tối đa 10MB)');
  }

  // 2. Đọc file text
  const text = await file.text();

  // 3. JSON.parse
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('File không hợp lệ: không parse được JSON');
  }

  // 4. Đảm bảo là array nhân viên
  let finalData: any[];
  if (!Array.isArray(parsed)) {
    const obj = parsed as Record<string, unknown>;
    // Nếu là single object, kiểm tra xem có phải 1 nhân viên không (có email và results)
    if (obj && typeof obj.email === 'string' && Array.isArray(obj.results)) {
      finalData = [obj];
    } else {
      throw new Error('File không hợp lệ: JSON phải là danh sách nhân viên hoặc 1 nhân viên mẫu');
    }
  } else {
    finalData = parsed;
  }

  if (finalData.length === 0) {
    throw new Error('File không có dữ liệu nhân viên nào');
  }

  // 5. Validate từng employee
  for (let i = 0; i < finalData.length; i++) {
    const emp = finalData[i] as Record<string, unknown>;

    if (!emp.email || typeof emp.email !== 'string') {
      throw new Error(`Nhân viên #${i + 1}: thiếu trường "email"`);
    }
    if (!emp.full_name || typeof emp.full_name !== 'string') {
      throw new Error(`Nhân viên #${i + 1}: thiếu trường "full_name"`);
    }
    if (!Array.isArray(emp.results)) {
      throw new Error(`Nhân viên "${emp.email}": thiếu trường "results"`);
    }

    // 6. Validate từng result
    for (let j = 0; j < (emp.results as unknown[]).length; j++) {
      const r = (emp.results as Record<string, unknown>[])[j];
      if (typeof r.competency_id !== 'number') {
        throw new Error(`Nhân viên "${emp.email}", result #${j + 1}: thiếu "competency_id"`);
      }
      if (typeof r.score !== 'number') {
        throw new Error(`Nhân viên "${emp.email}", result #${j + 1}: thiếu "score"`);
      }
      if (!Array.isArray(r.courses)) {
        throw new Error(`Nhân viên "${emp.email}", result #${j + 1}: thiếu "courses"`);
      }
      // Clamp score
      (r as Record<string, unknown>).score = Math.min(3, Math.max(0, r.score as number));

      // Đảm bảo các array tồn tại
      if (!Array.isArray(r.strengths)) r.strengths = [];
      if (!Array.isArray(r.limitations)) r.limitations = [];
      if (!Array.isArray(r.development_opportunities)) r.development_opportunities = [];
    }
  }

  return finalData as JsonData;
}
