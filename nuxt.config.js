import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  buildModules: ['@nuxtjs/strapi'],
  strapi: {
    url: process.env.API_URL || 'http://localhost:1337',
    prefix: '/api',
    version: 'v4',
    cookie: {}
  }
})
