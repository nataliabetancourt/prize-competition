// app/components/LandingSection.jsx
import Image from "next/image";
import dynamic from "next/dynamic";
import bg1 from "./assets/bg1.webp"; // Assuming this path is correct


// Preload the first background image for faster LCP
const preconnectImageHref = typeof window !== "undefined" ? bg1.src : "";

// Load the slideshow & other backgrounds ONLY on the client with a proper fallback
const LandingSectionClient = dynamic(() => import("./LandingSectionClient"), {
  ssr: false,
});

export default function LandingSection({ translations }) {
  return (
    <div className="relative h-screen w-full">
      {/* Preload first image - helps with LCP */}
      {preconnectImageHref && (
        <>
          <link rel="preload" as="image" href={preconnectImageHref} />
          <link
            rel="preconnect"
            href="https://app.tireconnect.ca"
            crossOrigin="anonymous"
          />
        </>
      )}

      {/* simple CSS background with fallback color */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        {/* Load just the first image server-side for better LCP */}
        <div className="absolute inset-0">
          <Image
            src={bg1}
            alt="Tire Store Service Center"
            fill
            priority={true}
            sizes="100vw"
            className="object-cover"
            style={{ filter: "brightness(50%)" }}
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23111827'/%3E%3C/svg%3E"
          />
        </div>
      </div>

      {/* server‑rendered hero text & CTA for fastest LCP */}
      <div className="relative z-10 container mx-auto px-2 sm:px-4 lg:px-4 h-full flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-violet-300 font-medium text-lg">
            {translations.tagline}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mt-2">
            {translations.title}
            <br />
            {translations.titleContinue}
          </h1>
          <a
            href="/shop-tires/"
            className="bg-violet-600 mt-8 inline-block text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-violet-700 transition-colors duration-300"
          >
            {translations.ctaButton}
          </a>
        </div>
      </div>

      {/* now load the slideshow & widget on the client only */}
      <LandingSectionClient />
    </div>
  );
}