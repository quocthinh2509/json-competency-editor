'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEditorStore } from '@/store/editorStore';
import EditorLayout from '@/components/editor/EditorLayout';

export default function EditorPage() {
  const router = useRouter();
  const data = useEditorStore((s) => s.data);

  useEffect(() => {
    if (data.length === 0) {
      router.replace('/');
    }
  }, [data, router]);

  if (data.length === 0) return null;

  return <EditorLayout />;
}
