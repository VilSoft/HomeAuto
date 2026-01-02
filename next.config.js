/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        MONGO_URI: "mongodb://localhost:27017/MastersSwimTimes"
    },
    reactStrictMode: true,
    output: "standalone", // forces a server-rendered build with BUILD_ID
    distDir: ".next",     // ensure default build folder
}

module.exports = nextConfig
