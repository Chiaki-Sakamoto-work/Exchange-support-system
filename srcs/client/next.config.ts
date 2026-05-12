/** @type {import('next').NextConfig} */
const nextConfig = {
  // TurbopackやWebpackの解析対象から lightningcss を除外する
  serverExternalPackages: ["lightningcss"],
};

export default nextConfig;
