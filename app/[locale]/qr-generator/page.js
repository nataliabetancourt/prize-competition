import { Suspense } from 'react';
import TranslationsProvider from "@/TranslationsProvider";
import initTranslations from "@/i18n";
import dynamic from "next/dynamic";

// Import QR generator translations
import qrGeneratorEn from "@/locales/en/qr-generator.json";

// Dynamic import the client component
const QRCodeGenerator = dynamic(
  () => import('@/components/admin/QRCodeGenerator'),
  { 
    ssr: false,
    loading: () => <div className="flex justify-center items-center h-64">Loading...</div>
  }
);

const i18nNameSpaces = ["common"];

export default async function QRGeneratorPage({ params: { locale } }) {
  const { resources } = await initTranslations(locale, i18nNameSpaces);
  
  // Get QR generator translations based on locale
  const qrTranslations = locale === "en" ? qrGeneratorEn.QRGenerator : qrGeneratorEs.QRGenerator;

  return (
    <div className="min-h-screen bg-gray-100">
      <TranslationsProvider
        resources={resources}
        locale={locale}
        namespaces={i18nNameSpaces}
      >
        <div className="w-full min-h-screen bg-gray-100">
          <div className="container mx-auto pt-36 pb-4 px-4">
            <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
              {qrTranslations.title}
            </h1>
            <QRCodeGenerator translations={qrTranslations} locale={locale} />
          </div>
        </div>
      </TranslationsProvider>
    </div>
  );
}