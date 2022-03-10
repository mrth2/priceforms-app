import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  css: [
    '@/assets/css/main.css',
  ],
  buildModules: [
    '@nuxtjs/strapi',
  ],
  strapi: {
    url: process.env.API_URL || 'http://localhost:1337',
    prefix: '/api',
    version: 'v4',
    cookie: {}
  },
  build: {
    postcss: {
      postcssOptions: require('./postcss.config.js'),
    },
    transpile: ['@headlessui/vue']
  }
})
