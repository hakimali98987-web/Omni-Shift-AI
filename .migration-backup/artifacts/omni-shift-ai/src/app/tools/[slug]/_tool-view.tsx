'use client';

import dynamic from 'next/dynamic';

const ToolDetailView = dynamic(() => import('@/views/tool-detail'), {
  ssr: false,
});

export { ToolDetailView };
