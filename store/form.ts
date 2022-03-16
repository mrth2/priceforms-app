import { defineStore } from 'pinia';
import { ImageFragment } from '~/types/graphql';
import { strapiParser } from '~~/services/helper';
import { IForm } from '~~/types/form';

export const useFormStore = defineStore('form', {
  state: () => ({
    form: null as IForm,
    headerType: 'Left' as 'Left' | 'Center',
    socialIcons: [{
      type: 'facebook',
      icon: 'facebook-f',
    }, {
      type: 'twitter',
      icon: 'twitter'
    }, {
      type: 'linkedin',
      icon: 'linkedin-in'
    }, {
      type: 'instagram',
      icon: 'instagram'
    }, {
      type: 'youtube',
      icon: 'youtube'
    }] as Array<{
      type: keyof IForm['socialLinks'],
      icon: string
    }>
  }),
  getters: {
    getTheme: (state) => state.form.theme,
    getHomeStyle: (state) => state.form.homeStyle,
    getSocialUrl: (state) => {
      return (type: keyof IForm['socialLinks']): string => state.form.socialLinks[type]
    },
    getFooter: (state) => state.form.footer,
  },
  actions: {
    async loadForm() {
      if (this.form) return;
      const graphql = useStrapiGraphQL();
      const subDomain = useSubDomain();
      try {
        const { data } = await graphql(`
          ${ImageFragment}
          query Form {
            forms(filters: {subDomain: {eq: "${subDomain}"}}) {
              data {
                id
                attributes {
                  title
                  introBanner {
                    media {
                      ...Image
                    }
                    text
                  }
                  thankyouBanner {
                    media {
                      ...Image
                    }
                    text
                  }
                  zip {
                    ... on ComponentPriceFormText {
                      id
                      hint
                    }
                    ... on ComponentPriceFormZipCode {
                      id
                      code
                    }
                  }
                  button {
                    promo
                    return
                    joining
                  }
                  registerForm {
                    title
                    description
                    progress
                    placeholder {
                      firstName
                      lastName
                      email
                      phone
                    }
                  }
                  theme
                  homeStyle
                  socialLinks {
                    facebook
                    instagram
                    twitter
                    youtube
                    linkedin
                  }
                  footer {
                    policy
                    sitemap
                    disclaimer
                    copyright
                  }
                  logo {
                    ...Image
                  }
                  favicon {
                    ...Image
                  }
                  term
                }
              }
            }
          }
        `);
        if (data?.forms?.data?.length) {
          const form = strapiParser(data.forms.data[0]) as IForm;
          this.form = {
            ...form,
            favicon: strapiParser(form.favicon, 'favicon'),
            logo: strapiParser(form.logo, 'logo'),
            introBanner: {
              ...form.introBanner,
              media: strapiParser(form.introBanner.media)
            },
            thankyouBanner: {
              ...form.thankyouBanner,
              media: strapiParser(form.thankyouBanner.media)
            },
          };
        }
      } catch (e) {
        console.log(e.message);
      }
    }
  }
});