import type { Config } from 'tailwindcss'
import defaultConfig from 'tailwindcss/defaultConfig'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', ...defaultConfig.theme.fontFamily.serif],
      },
    },
  },
  plugins: [],
}

export default config
