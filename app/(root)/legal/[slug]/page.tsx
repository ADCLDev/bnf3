// app/(user)/legal/[slug]/page.tsx
import { LegalPageContent } from '@/components/legal/LegalPage';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function LegalPage({ params }: PageProps) {
  return <LegalPageContent slug={params.slug} />;
}