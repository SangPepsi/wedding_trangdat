/**
 * Thông tin đám cưới - dữ liệu gốc ở content/wedding.json (sửa qua trang /admin khi chạy npm run dev)
 * File này chỉ suy ra các giá trị hiển thị (thứ, ngày, buổi, link lịch...) từ dữ liệu gốc
 */
import { CONTENT, describeDate } from './content'

const { couple, event, addresses } = CONTENT

const start = describeDate(event.start)
const end = describeDate(event.end)
if (!start || !end) throw new Error('content/wedding.json: event.start/event.end phải có dạng YYYY-MM-DDTHH:mm')

/**
 * Ảnh bìa (trang trái thiệp đôi + ảnh xem trước khi chia sẻ link), khung tự căn theo tỉ lệ ảnh:
 * ảnh dọc/vuông được lấp đầy khung, ảnh ngang hiện trọn vẹn trên nền mờ của chính ảnh đó.
 * focus: điểm luôn giữ lại khi ảnh phải cắt bớt (thường là khuôn mặt), dạng 'ngang% dọc%'
 */
export const HERO_IMAGE = CONTENT.hero

/** Lời báo tin từ gia đình (trên thiệp) */
export const ANNOUNCEMENT = CONTENT.announcement

/** Địa chỉ nhà trai và nhà gái */
export const FAMILY_ADDRESSES = {
  groomFamily: { label: 'Nhà trai', ...addresses.groomFamily },
  brideFamily: { label: 'Nhà gái', ...addresses.brideFamily },
}

/** Tọa độ nơi làm lễ - dùng cho bản đồ nhúng */
export const VENUE_COORDINATES = { lat: event.venueLat, lng: event.venueLng }

function toCalendarDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

const calendarDetails = `${event.ceremonyName} (${event.ceremonyTime.split(/\s*-\s*/)[0]}) & ${event.mealName} (${event.mealTime.split(/\s*-\s*/)[0]}) - Trân trọng kính mời`

export const WEDDING = {
  ...couple,
  date: start.date,
  dateShort: start.dateShort,
  startISO: start.iso,
  endISO: end.iso,
  ceremony: {
    name: event.ceremonyName,
    time: event.ceremonyTime,
    timeDisplay: start.timeDisplay,
    venue: event.ceremonyVenue,
    dayOfWeek: start.dayOfWeek,
    day: start.day,
    month: `THÁNG ${start.month}`,
    year: start.year,
    lunarYear: event.lunarYear,
    lunarDate: event.lunarDate,
    location: event.location,
  },
  intimateMeal: {
    name: event.mealName,
    time: event.mealTime,
    venue: event.mealVenue,
  },
  addToCalendarUrl: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Đám cưới ${couple.groom} & ${couple.bride}`)}&dates=${toCalendarDate(start.iso)}/${toCalendarDate(end.iso)}&ctz=Asia/Ho_Chi_Minh&details=${encodeURIComponent(calendarDetails)}&location=${encodeURIComponent(event.location)}`,
}

/** Nội dung Hành trình yêu */
export const LOVE_STORY = {
  title: CONTENT.story.title,
  story: CONTENT.story.text,
  timeline: CONTENT.story.timeline,
}
