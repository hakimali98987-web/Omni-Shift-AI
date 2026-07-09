'use client';

import dynamic from 'next/dynamic';

const CategoryDetailView = dynamic(() => import('@/views/category-detail'), {
  ssr: false,
});

export { CategoryDetailView };
