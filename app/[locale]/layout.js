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
  title: "TSSC Prize Competition",
  description:
    "Expert tire sales, auto repair, and maintenance across Texas. Trust our technicians for top care. Book your appointment online today!",
  publisher: "TIRESTORE SERVICE CENTER by eMETHOD Inc.",
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