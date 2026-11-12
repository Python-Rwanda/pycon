import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";
import YAML from "yaml";

// "/" always goes to the current edition, set in content/conference.yaml → current_edition.
const { current_edition } = YAML.parse(fs.readFileSync(path.join(process.cwd(), "content/conference.yaml"), "utf8"));

const nextConfig: NextConfig = {
  images: {
    // Cloudinary images are resized by Cloudinary itself (see src/components/Img.tsx).
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  async redirects() {
    return [
      // Temporary (307) so that switching to next year's edition takes effect immediately.
      { source: "/", destination: `/${current_edition}`, permanent: false },
      // The content editor (Sveltia CMS) is a static page in public/admin.
      { source: "/admin", destination: "/admin/index.html", permanent: false },
    ];
  },
};

export default nextConfig;
