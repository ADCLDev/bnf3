// app/(user)/legal/[slug]/page.tsx
import LegalPage from '@/components/legal/LegalPage';
import { Metadata } from 'next';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params }: PageProps) {
  return <LegalPage slug={params.slug} />;
}