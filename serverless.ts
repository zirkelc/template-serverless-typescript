import type { AWS as Serverless } from 'osls';

/**
 * Shims for CommonJS compatibility.
 * @link https://github.com/evanw/esbuild/issues/1921#issuecomment-1623640043
 */
const cjsShimBanner = `
/* COMMONJS SHIM BANNER START */
globalThis.require = (await import("node:module")).createRequire(import.meta.url);
globalThis.__filename = (await import("node:url")).fileURLToPath(import.meta.url);
globalThis.__dirname = (await import("node:path")).dirname(__filename);
/* COMMONJS SHIM BANNER END */
`;

const config: Serverless = {
  service: '<SERVICE>',
  frameworkVersion: '3',
  package: {
    individually: true,
  },
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    stage: '${opt:stage, env:STAGE, "dev"}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    httpApi: {
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iam: {
      role: {
        statements: [],
      },
    },
    logRetentionInDays: 14,
  },
  custom: {
    esbuild: {
      format: 'esm',
      outputFileExtension: '.mjs',
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      banner: {
        js: cjsShimBanner,
      },
    },
  },
  functions: {
    hello: {
      handler: './src/functions/hello.handler',
      url: true,
    },
  },
};

export default config;
