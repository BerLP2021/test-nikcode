/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ['image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'commons.wikimedia.org',
                port: '',
            }
        ],
    },
    // env: {
    //     GEO_URL: process.env.GEO_CITIES_API,
    //     WIKI_URL: process.env.WIKIDATA_API,
    //     X_RAPIDAPI_KEY: process.env.WIKIDATA_API
    // },
};

export default nextConfig;
