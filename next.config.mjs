/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  serverExternalPackages: [
    '@mastra/core',
    '@mastra/libsql',
    '@mastra/memory',
    'mastra'
  ],
  webpack: (config, { isServer }) => {
    // Markdown
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });

    // Native .node modules
    if (isServer) {
      config.externals = [...(config.externals || []), /\.node$/];
      
      // Externalize mastra packages to avoid webpack bundling issues
      config.externals.push({
        '@mastra/core': 'commonjs @mastra/core',
        '@mastra/libsql': 'commonjs @mastra/libsql',
        '@mastra/memory': 'commonjs @mastra/memory',
        'mastra': 'commonjs mastra',
      });
    } else {
      config.module.rules.push({
        test: /\.node$/,
        use: 'file-loader',
      });
    }

    // Ignore .d.ts files
    config.module.rules.push({
      test: /\.d\.ts$/,
      loader: 'ignore-loader',
    });

    // ✅ Ignore LICENSE, README, CHANGELOG
    config.module.rules.push({
      test: /(LICENSE|README|CHANGELOG)(\..*)?$/i,
      use: 'ignore-loader',
    });

    // ✅ Alias the problematic file directly
    config.resolve.alias['@libsql/hrana-client/LICENSE'] = false;

    return config;
  },
  turbopack: {},
};

export default nextConfig;
