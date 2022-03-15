import { defineStore } from 'pinia';
import { ImageFragment } from '~/types/graphql';
import { strapiParser } from '~~/services/helper';
import { IForm } from '~~/types/form';

export const useFormStore = defineStore('form', {
  state: () => ({
    form: null as IForm
  }),
  getters: {
    getTheme: (state) => state.form.theme,
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