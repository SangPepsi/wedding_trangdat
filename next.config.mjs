/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Bộ nhớ đệm ảnh chỉ dựa vào đường dẫn: khi dev, chép đè ảnh trùng tên sẽ hiện ảnh mới sau tối đa 60 giây
    ...(process.env.NODE_ENV === 'development' && { minimumCacheTTL: 60 }),
  },
}

export default nextConfig
