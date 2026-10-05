# Thiệp cưới online - Đức Toàn & Nhật Minh

Next.js 16, React 19, Tailwind CSS 4. Trang tĩnh, deploy miễn phí trên Vercel.

## Chạy trên máy

Cần Node.js 20.9 trở lên.

```powershell
npm install
copy .env.example .env.local   # rồi điền các giá trị trong file
npm run dev                    # mở http://localhost:3000
```

Kiểm tra trước khi deploy:

```powershell
npm run typecheck
npm run lint
npm run build
```

## Sửa nội dung

Cách dễ nhất: chạy `npm run dev` rồi mở **http://localhost:3000/admin** để sửa tên cô dâu chú rể, ngày giờ, địa điểm, tên bố mẹ, câu chuyện, ảnh bìa, album, tài khoản mừng cưới, nhạc nền. Bấm **Lưu** (hoặc Ctrl + S) là thiệp trên máy cập nhật ngay; muốn khách thấy thì commit và deploy lại.

Trang `/admin` chỉ hoạt động khi chạy `npm run dev` và chỉ nhận yêu cầu từ chính máy đó (`localhost`); bản deploy trên Vercel trả về 404.

Toàn bộ nội dung nằm trong `content/wedding.json` (có thể sửa tay). Ảnh và nhạc tải lên qua trang quản trị được lưu vào `public/gallery`, `public/qrcode`, `public/music` với tên mới (không ghi đè file cũ). Các file khác:

| File | Nội dung |
|---|---|
| `lib/content.ts` | Kiểu dữ liệu và kiểm tra hợp lệ của `content/wedding.json` |
| `lib/constants.ts` | Tự suy ra thứ, ngày, buổi, link "Thêm vào lịch"... từ dữ liệu gốc |
| `lib/themes.ts` + `app/globals.css` | Các bộ màu |

Ảnh xem trước khi chia sẻ link (`app/opengraph-image.tsx`) được tạo tự động từ ảnh bìa cùng tên và ngày cưới.

Ảnh bìa tự căn theo khung: ảnh dọc/vuông được lấp đầy và cắt quanh điểm `focus` (đặt vào khuôn mặt, ví dụ `'68% 50%'`), ảnh ngang được hiện trọn trên nền mờ của chính ảnh.

## Link mời riêng cho từng khách

Thêm `?to=` vào cuối link, ví dụ:

```
https://your-domain.vercel.app/?to=Anh%20Minh%20%26%20Ch%E1%BB%8B%20Lan
```

Thiệp sẽ hiện "Trân trọng kính mời Anh Minh & Chị Lan", đồng thời tên được điền sẵn vào form xác nhận và sổ lưu bút. Có thể gõ tiếng Việt có dấu trực tiếp vào thanh địa chỉ, trình duyệt tự mã hóa.

## Thêm bộ màu mới

1. Thêm một khối `[data-theme='ten-moi'] { ... }` trong `app/globals.css` với 9 biến gốc (xem các theme sáng có sẵn).
2. Thêm `'ten-moi': { name: 'Tên hiển thị' }` vào `THEMES` trong `lib/themes.ts`.

Component dùng các lớp `text-w-strong`, `bg-w-card`, `border-w-line`… nên tự đổi màu theo theme, không cần `!important`.

## Deploy lên Vercel

1. Đẩy code lên GitHub.
2. Trên [vercel.com](https://vercel.com): Add New → Project → chọn repo → Deploy.
3. Vào Settings → Environment Variables, khai báo các biến trong `.env.example`, rồi Redeploy.
"# wedding_toanminh" 
