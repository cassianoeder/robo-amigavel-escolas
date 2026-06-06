/** @type {import('next').NextConfig} */
const nextConfig = {
    // Deprecated middleware to proxy issue
    // but also we need allowedDevOrigins
    serverExternalPackages: ['@libsql/client', 'bcryptjs'],
    allowedDevOrigins: ['192.168.88.8', 'localhost', '*']
};

export default nextConfig;
