import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  rules: {
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  }
  
};

export default nextConfig;
