// app/layout.tsx (or layout.jsx)
import { Montserrat } from "next/font/google";
import Script from "next/script";
import { Suspense } from 'react';
import { Analytics } from "@vercel/analytics/next"

// Styles
import "@/globals.css";

// Fonts - Optimize with display swap for better loading experience
const montserrat = Montserrat({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-montserrat',
  preload: true,
});

// Components
import Navbar from "@/components/common/Navbar/navbar";
import Footer from "@/components/common/Footer/footer";

// Loading states for components
const NavbarFallback = () => <div className="w-full h-16 bg-gray-100" aria-hidden="true" />;
const FooterFallback = () => <div className="w-full h-24 bg-gray-100" aria-hidden="true" />;

export const metadata = {
  title: "Top Auto Repair & Tire Shop in TX - Tire Store Service Center",
  description:
    "Expert tire sales, auto repair, and maintenance across Texas. Trust our technicians for top care. Book your appointment online today!",
  keywords:
    "tire store service center, tire store, tire shop, tire repair shop, tire repair service, tire repair near me, auto repair shop, auto repair service, auto repair near me, car repair shop, car repair service, car repair near me, oil change service, oil change near me, brake repair service, brake repair near me, wheel alignment service, wheel alignment near me",
  language: "en",
  subject: "Auto Repair & Tire Shop in TX",
  coverage: "United States",
  robots: "index, follow",
  author: "Tire Store Service Center",
  publisher: "TIRESTORE SERVICE CENTER by eMETHOD Inc.",
  og: {
    type: "website",
    title: "Top Auto Repair & Tire Shop in TX - Tire Store Service Center",
    description:
      "Tire Store Service Center offers expert auto repair, tire sales, and maintenance services across Texas. Our technicians ensure top-notch care for your vehicle, from tires to repairs. Schedule an appointment online today!",
    site_name: "Tire Store Service Center",
    url: "https://www.tirestoretx.com/",
  },
  alternates: {
    canonical: "https://www.tirestoretx.com/",
    languages: {
      en: "https://www.tirestoretx.com/en",
      es: "https://www.tirestoretx.com/es",
    },
  },
  // Add viewport meta tag for responsive design
  viewport: 'width=device-width, initial-scale=1',
};

export default function Layout({ children }) {
  return (
    <html lang="es" className={montserrat.variable}>
      <head>
        
      </head>
      <body
        className={`${montserrat.className} text-grey-400 mx-auto text-sm md:text-base font-normal relative`}
      >        
        {/* Navbar - consider keeping outside Suspense if it's critical for navigation */}
        <Suspense fallback={<NavbarFallback />}>
          <Navbar />
        </Suspense>
        
        {/* Main content - no Suspense here as children already manage their own loading states */}
        <main>{children}</main>
        
        {/* Footer - can be lazy loaded */}
        <Suspense fallback={<FooterFallback />}>
          <Footer />
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}