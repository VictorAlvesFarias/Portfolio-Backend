/** 
 *@type {import('next').NextConfig} 
*/
const nextConfig ={  
    experimental: {
        esmExternals: "loose", // <-- add this
        serverComponentsExternalPackages: ["mongoose"] // <-- and this
    },
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                pathname: '**'
            },
            {
                protocol: 'http',
                hostname: '**',
                pathname: '**'
            }
        ],
}
}

module.exports = nextConfig