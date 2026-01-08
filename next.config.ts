import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet' },
                ],
            },
        ];
    },
    // ClerkとNext.js 15の互換性のため
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
    // Clerkの内部モジュールをトランスパイルする
    transpilePackages: ['@clerk/nextjs'],
};

export default nextConfig;
