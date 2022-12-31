/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = withPWA({
  reactStrictMode: true,
  dynamicStartUrl: true,
  i18n: {
    locales: ['en-US', 'zh-CN'],
    defaultLocale: 'en-US',
  },
})
