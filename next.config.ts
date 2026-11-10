import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async headers() {
    return [
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
