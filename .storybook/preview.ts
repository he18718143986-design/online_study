import type { Preview } from '@storybook/react'
import '../src/styles/tailwind.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#F6F7F8' },
        { name: 'dark', value: '#0D1117' },
        { name: 'white', value: '#FFFFFF' }
      ]
    }
  }
}

export default preview
