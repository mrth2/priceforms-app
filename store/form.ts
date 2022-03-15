import { defineStore } from 'pinia';
import { ImageFragment } from '~/types/graphql';
import { strapiParser } from '~~/services/helper';
import { IForm } from '~~/types/form';

export const useFormStore = defineStore('form', {
  state: () => ({
    form: null as IForm,
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
    getSocialUrl: (state) => {
      return (type: keyof IForm['socialLinks']): string => state.form.socialLinks[type]
    }
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
                  theme
                  socialLinks {
                    facebook
                    instagram
                    twitter
                    youtube
                    linkedin
                  }
                  logo {
                    ...Image
                  }
                  favicon {
                    ...Image
                  }
                }
              }
            }
          }
        `);
        if (data?.forms?.data?.length) {
          const form = strapiParser(data.forms.data[0])
          this.form = {
            ...form,
            favicon: strapiParser(form.favicon, 'favicon'),
            logo: strapiParser(form.logo, 'logo')
          };
        }
      } catch (e) {
        console.log(e.message);
      }
    }
  }
});