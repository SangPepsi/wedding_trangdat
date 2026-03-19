/**
 * Thông tin đám cưới - cập nhật tại đây
 */

/** Ảnh nền Hero - dùng ảnh đầu gallery hoặc đường dẫn tùy chỉnh */
export const HERO_BACKGROUND = '/gallery/1.jpg'

/** Lời báo tin từ gia đình (trên thiệp) */
export const ANNOUNCEMENT = 'TRÂN TRỌNG BÁO TIN LỄ THÀNH HÔN CỦA CON CHÚNG TÔI'

/** Địa chỉ nhà trai và nhà gái */
export const FAMILY_ADDRESSES = {
  groomFamily: {
    label: 'Nhà trai',
    address: 'Thôn Nội Lăng, xã Tân Hưng, Tỉnh Hưng Yên',
    mapsUrl: 'https://www.google.com/maps/dir//%C4%90%C3%ACnh+l%C3%A0ng+th%C3%B4n+N%E1%BB%99i+L%C4%83ng,+Th%E1%BB%A7+S%C4%A9,+Ti%C3%Aan+L%E1%BB%AF,+H%C6%B0ng+Y%C3%Aan,+Vi%E1%BB%87t+Nam/@21.020672,105.8151741,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3135c0fcc723b6df:0x43d0422c9f480f1f!2m2!1d106.1004076!2d20.6635739?entry=ttu',
  },
  brideFamily: {
    label: 'Nhà gái',
    address: 'Thôn Nội Lăng, xã Tân Hưng, Tỉnh Hưng Yên',
    mapsUrl: 'https://www.google.com/maps/dir//%C4%90%C3%ACnh+l%C3%A0ng+th%C3%B4n+N%E1%BB%99i+L%C4%83ng,+Th%E1%BB%A7+S%C4%A9,+Ti%C3%Aan+L%E1%BB%AF,+H%C6%B0ng+Y%C3%Aan,+Vi%E1%BB%87t+Nam/@21.020672,105.8151741,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3135c0fcc723b6df:0x43d0422c9f480f1f!2m2!1d106.1004076!2d20.6635739?entry=ttu',
  },
}

export const WEDDING = {
  groom: 'Tiến Đạt',
  bride: 'Thị Trang',
  groomShort: 'Đạt',
  brideShort: 'Trang',
  date: '20 tháng 12, 2026',
  dateShort: '20/12/2026',
  dateISO: '2026-12-20',
  ceremony: {
    name: 'Lễ thành hôn',
    time: '14:00 - 15:30',
    venue: 'Tại gia',
  },
  intimateMeal: {
    name: 'Bữa cơm thân mật',
    time: '17:00 - 18:00',
    venue: 'Tại gia',
  },
  hashtag: '#TienDatThiTrang2026',
  addToCalendarUrl: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Đám+cưới+Tiến+Đạt+%26+Thị+Trang&dates=20261220T070000Z/20261220T160000Z&details=Chúc+mừng+ngày+trọng+đại&location=Nhà+thờ+Tân+Định`,
}

/** Nội dung Hành trình yêu */
export const LOVE_STORY = {
  title: 'Hành trình yêu',
  timeline: [
    { date: '05-2023', event: 'Lần đầu gặp gỡ' },
    { date: '2024', event: 'Chuyến đi đầu tiên' },
    { date: '2025', event: 'Lời cầu hôn ngọt ngào' },
    { date: '2026', event: 'Về chung một nhà' },
  ],
}
