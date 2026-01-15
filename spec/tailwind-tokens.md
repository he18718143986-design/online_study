# Tailwind Tokens 片段（建议）

> 将设计 tokens 落到工程配置，避免在组件中散落魔法值。

把下面内容按工程形态合并进 `tailwind.config.*`（若已存在相同 key，以现有为准）。

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#0A6EF0',
        'primary-600': '#0A58D6',
        bg: '#F6F7F8',
        surface: '#FFFFFF',
        text: '#0D141B',
        muted: '#6B7280'
      },
      spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px' },
      borderRadius: { DEFAULT: '8px' },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.04)',
        md: '0 8px 24px rgba(0,0,0,0.06)'
      },
      transitionDuration: { fast: '120ms', medium: '200ms' }
    }
  }
}
```
