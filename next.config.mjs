/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/docs", destination: "/notes", permanent: true },
      { source: "/docs/:slug", destination: "/notes/:slug", permanent: true }
    ];
  },
  async headers() {
    return [
      {
        source: "/documents/:file*",
        headers: [
          { key: "Content-Type", value: "application/pdf" },
          {
            key: "Content-Disposition",
            value: 'attachment; filename="Pablo_Rigalli_Senior_Software_Engineer_2026_EN.pdf"'
          },
          { key: "Cache-Control", value: "public, max-age=86400" },
          { key: "X-Content-Type-Options", value: "nosniff" }
        ]
      }
    ];
  }
};

export default nextConfig;
