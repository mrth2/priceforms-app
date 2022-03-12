import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  meta: {
    title: "PriceForms",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "PriceForms is a SaaS platform build for form owners." },      
    ],
    link: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ]
  },
  css: [
    '@/assets/css/main.css',
  ],
  buildModules: [
    '@nuxtjs/strapi',
    '@pinia/nuxt'
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
    transpile: ['@headlessui/vue', '@heroicons/vue'],
  }
})
