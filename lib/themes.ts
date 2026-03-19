/**
 * Các theme màu nền cho trang cưới
 * Thổ (Earth), Mộc (Wood) - Ngũ hành
 */
export const THEMES = {
  red: {
    name: 'Đỏ',
    main: 'bg-red-200',
    section: 'bg-red-300',
    sectionAlt: 'bg-red-200',
    accent: 'red',
  },
  green: {
    name: 'Xanh lá',
    main: 'bg-green-200',
    section: 'bg-green-300',
    sectionAlt: 'bg-green-200',
    accent: 'green',
  },
  pink: {
    name: 'Hồng',
    main: 'bg-rose-200',
    section: 'bg-rose-300',
    sectionAlt: 'bg-rose-200',
    accent: 'rose',
  },
  white: {
    name: 'Trắng',
    main: 'bg-gray-100',
    section: 'bg-gray-200',
    sectionAlt: 'bg-gray-100',
    accent: 'gray',
  },
  tho: {
    name: 'Mệnh Thổ',
    main: 'theme-tho',
    section: 'theme-tho-section',
    sectionAlt: 'theme-tho-section',
    accent: 'amber',
  },
  moc: {
    name: 'Mệnh Mộc',
    main: 'theme-moc',
    section: 'theme-moc-section',
    sectionAlt: 'theme-moc-section',
    accent: 'green',
  },
  bordeaux: {
    name: 'Đỏ đậm',
    main: 'theme-bordeaux',
    section: 'theme-bordeaux-section',
    sectionAlt: 'theme-bordeaux-section',
    accent: 'red',
  },
} as const

export type ThemeId = keyof typeof THEMES
