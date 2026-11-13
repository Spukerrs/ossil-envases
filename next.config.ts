import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value: '<https://ossil-envases-demo.vercel.app/>; rel="canonical"',
          },
        ],
      },
      {
        source: "/links/",
        headers: [
          {
            key: "Link",
            value: '<https://ossil-envases-demo.vercel.app/links/>; rel="canonical"',
          },
        ],
      },
      {
        source: "/admin/precios/",
        headers: [
          {
            key: "Link",
            value: '<https://ossil-envases-demo.vercel.app/admin/precios/>; rel="canonical"',
          },
        ],
      },
      {
        source: "/producto/:id/",
        headers: [
          {
            key: "Link",
            value: '<https://ossil-envases-demo.vercel.app/producto/:id/>; rel="canonical"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
