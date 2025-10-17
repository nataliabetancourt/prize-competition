/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable the App Router (if not already enabled)
    experimental: {
      // Any experimental features needed
    },
    
    // Handle redirects for internationalization
    async redirects() {
      return [
        {
          source: '/',
          destination: '/en',
          permanent: true,
        },
        // Additional redirect for /blogs 
        {
          source: '/blogs',
          destination: '/en/blogs',
          permanent: true,
        },
        // Add similar redirects for other main routes as needed
      ];
    },
    
    // Image configuration for Next.js Image component
    images: {
      domains: [
        // Add your image domains here
        'images.unsplash.com',
        'localhost'
      ],
    },
    
    // React strict mode (recommended)
    reactStrictMode: true,
  };
  
  export default nextConfig;