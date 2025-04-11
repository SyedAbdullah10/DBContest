// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'oci-secrets': false,
        'oci-common': false,
        'oci-objectstorage': false,
        '@azure/identity': false,
        '@azure/app-configuration': false,
        '@azure/keyvault-secrets': false,
      };
  
      return config;
    }
  };
  
  export default nextConfig;
  