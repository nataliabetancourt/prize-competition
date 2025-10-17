import { Suspense } from 'react';
import TranslationsProvider from "@/TranslationsProvider";
import initTranslations from "@/i18n";
import dynamic from "next/dynamic";

// Import competition translations
import competitionEn from "@/locales/en/competition.json";
import competitionEs from "@/locales/es/competition.json";

// Dynamic import the client component
const CompetitionEntry = dynamic(
  () => import('@/components/competition/CompetitionEntry'),
  { 
    ssr: false,
    loading: () => <div className="flex justify-center items-center h-screen bg-slate-950">
      <div className="text-white">Loading...</div>
    </div>
  }
);

const i18nNamespaces = ["common"];

export default async function CompetitionPage({ params: { locale } }) {
  const { resources } = await initTranslations(locale, i18nNamespaces);
  
  // Get competition translations based on locale
  const competitionTranslations = locale === "en" 
    ? competitionEn.competition 
    : competitionEs.competition;

  return (
    <TranslationsProvider
      resources={resources}
      locale={locale}
      namespaces={i18nNamespaces}
    >
      <CompetitionEntry translations={competitionTranslations} locale={locale} />
    </TranslationsProvider>
  );
}