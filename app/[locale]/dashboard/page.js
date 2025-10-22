import { Suspense } from 'react';
import TranslationsProvider from "@/TranslationsProvider";
import initTranslations from "@/i18n";
import dynamic from "next/dynamic";

// Import dashboard translations
import dashboardEn from "@/locales/en/dashboard.json";
import dashboardEs from "@/locales/es/dashboard.json";

// Dynamic import the client component
const Dashboard = dynamic(
  () => import('@/components/dashboard/Dashboard'),
  { 
    ssr: false,
    loading: () => <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-gray-600">Loading dashboard...</div>
    </div>
  }
);

const i18nNamespaces = ["common"];

export default async function DashboardPage({ params: { locale } }) {
  const { resources } = await initTranslations(locale, i18nNamespaces);
  
  // Get dashboard translations based on locale
  const dashboardTranslations = locale === "en" 
    ? dashboardEn.dashboard 
    : dashboardEs.dashboard;

  return (
    <TranslationsProvider
      resources={resources}
      locale={locale}
      namespaces={i18nNamespaces}
    >
      <Dashboard translations={dashboardTranslations} locale={locale} />
    </TranslationsProvider>
  );
}