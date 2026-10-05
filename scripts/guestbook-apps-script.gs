/**
 * Sổ lưu bút cho thiệp cưới - Google Apps Script
 *
 * Cài đặt (khoảng 5 phút):
 * 1. Mở Google Sheet sẽ dùng để lưu lời chúc (tab "LoiChuc" và dòng tiêu đề được tạo tự động).
 * 2. Menu Tiện ích mở rộng → Apps Script, xóa code mẫu, dán toàn bộ file này vào, bấm Lưu.
 * 3. Bấm Triển khai → Tùy chọn triển khai mới → chọn loại "Ứng dụng web":
 *      - Thực thi với tư cách: Tôi
 *      - Người có quyền truy cập: Bất kỳ ai
 *    Bấm Triển khai, cấp quyền, rồi copy "URL ứng dụng web" (kết thúc bằng /exec).
 * 4. Dán URL đó vào biến NEXT_PUBLIC_GUESTBOOK_URL trong .env.local (và trên Vercel).
 *
 * Kiểm duyệt: gõ chữ x vào cột "Ẩn" để ẩn một lời chúc khỏi trang web.
 * Sau khi sửa code này phải Triển khai lại (Quản lý triển khai → Chỉnh sửa → Phiên bản mới).
 */

/** @OnlyCurrentDoc */

var SHEET_NAME = 'LoiChuc'
var MAX_NAME = 60
var MAX_MESSAGE = 500
var MAX_ENTRIES = 200

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Thời gian', 'Tên', 'Lời chúc', 'Ẩn'])
    sheet.setFrozenRows(1)
  }
  return sheet
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON)
}

function clean_(value, max) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

function cleanMessage_(value, max) {
  return String(value || '')
    .replace(/\r\n?/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max)
}

function doGet() {
  var sheet = getSheet_()
  var lastRow = sheet.getLastRow()
  if (lastRow < 2) return json_({ entries: [] })

  var rows = sheet.getRange(2, 1, lastRow - 1, 4).getValues()
  var entries = rows
    .filter(function (r) {
      return r[1] && r[2] && !String(r[3]).trim()
    })
    .map(function (r) {
      return { createdAt: new Date(r[0]).toISOString(), name: String(r[1]), message: String(r[2]) }
    })
    .reverse()
    .slice(0, MAX_ENTRIES)

  return json_({ entries: entries })
}

function doPost(e) {
  var lock = LockService.getScriptLock()
  try {
    lock.waitLock(10000)
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}')

    // Trường ẩn chống spam: người thật không bao giờ điền
    if (body.website) return json_({ ok: true })

    var name = clean_(body.name, MAX_NAME)
    var message = cleanMessage_(body.message, MAX_MESSAGE)
    if (!name || !message) return json_({ ok: false, error: 'Vui lòng nhập tên và lời chúc' })

    // Chặn công thức bảng tính (=, +, -, @) bị chèn vào ô
    if (/^[=+\-@]/.test(name)) name = "'" + name
    if (/^[=+\-@]/.test(message)) message = "'" + message

    getSheet_().appendRow([new Date(), name, message, ''])
    return json_({ ok: true })
  } catch (err) {
    return json_({ ok: false, error: 'Không thể lưu lời chúc' })
  } finally {
    lock.releaseLock()
  }
}
