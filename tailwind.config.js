import daisyui from 'daisyui'
import typography from '@tailwindcss/typography'

export default {
   content: ['./src/renderer/src/*.css', './src/renderer/src/*.tsx'],
   daisyui: {
      themes: ['light'],
   },
   plugins: [daisyui, typography],
}
