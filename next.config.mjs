/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'via.placeholder.com',
        },
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
        },
          {
          protocol: 'https',
          hostname: 'media.istockphoto.com',
        },
      ],
    },
  };
  
  export default nextConfig;
