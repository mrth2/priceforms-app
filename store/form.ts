import { defineStore } from 'pinia';
import { ImageFragment } from '~/types/graphql';
import { strapiParser } from '~~/services/helper';
import { IForm, IFormCategoryFlow, IFormQuestion } from '~~/types/form';

const socialIcons = [{
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
}>;

export const useFormStore = defineStore('form', {
  state: () => ({
    form: null as IForm,
    flows: [] as IFormCategoryFlow[],
    socialIcons,
  }),
  getters: {
    getTheme: (state) => state.form.theme,
    getHeaderStyle: (state) => state.form.headerStyle,
    getHomeStyle: (state) => state.form.homeStyle,
    getSocialUrl: (state) => {
      return (type: keyof IForm['socialLinks']): string => state.form.socialLinks[type]
    },
    getFooter: (state) => state.form.footer,
    getPhone: (state) => state.form.phone,
    getFirstQuestion: (state) => {
      return (flowId: number) => {
        return state.flows.find(flow => flow.id === flowId)?.questions[0];
      }
    },
    getQuestionById: (state) => {
      return (qid: number) => {
        let result: IFormQuestion | undefined;
        state.flows.forEach(flow => {
          flow.questions.forEach(question => {
            if (question.id === qid) {
              result = question;
            }
          });
        })
        return result;
      }
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
                    button
                    placeholder {
                      firstName
                      lastName
                      email
                      phone
                    }
                  }
                  categoryForm {
                    title
                    progress
                  }
                  theme
                  headerStyle
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
                  phone {
                    label
                    number
                  }
                  categories (sort: "ordering:ASC")  {
                    data {
                      id
                      attributes {
                        title
                        icon {
                          ...Image
                        }
                        iconActive {
                          ...Image
                        }
                        startFlow {
                          data {
                            id
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `);
        if (data?.forms?.data?.length) {
          const form = strapiParser(data.forms.data[0]) as IForm;
          const categories = (form.categories as any).data;
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
            categories: categories.map((category) => {
              const parsedCategory = strapiParser(category);
              return {
                ...parsedCategory,
                icon: strapiParser(category.attributes.icon, 'icon'),
                iconActive: strapiParser(category.attributes.iconActive, 'iconActive'),
                startFlow: strapiParser(category.attributes.startFlow, 'startFlow'),
              }
            }),
          };
        }
      } catch (e) {
        console.log(e.message);
      }
    },
    async loadFlows() {
      const graphql = useStrapiGraphQL();
      const subDomain = useSubDomain();
      try {
        const { data } = await graphql(`
          ${ImageFragment}
          query FLOWS {
            formCategoryFlows(filters:{form: {subDomain: {eq : "${subDomain}"}}}) {
              data {
                id
                attributes {
                  name
                  questions(pagination:{pageSize: 50}) {
                    id
                    title
                    description
                    type
                    question
                    options(pagination:{pageSize: 20}) {
                      id
                      value
                      minPrice
                      maxPrice
                      currency
                      discountPercent
                      icon {
                        ...Image
                      }
                      iconActive {
                        ...Image
                      }
                      nextFlow {
                        data {
                          id
                        }
                      }
                    }
                    hasNext
                    nextButtonOnTop
                    showEstimate
                    canSelectMulti
                    otherwiseFlow {
                      data {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        `);
        if (data?.formCategoryFlows?.data?.length) {
          this.flows = data.formCategoryFlows.data.map((_flow) => {
            // parse flow
            const flow = strapiParser(_flow) as IFormCategoryFlow;
            // parse flow questions
            const questions = flow.questions.map((_question: IFormCategoryFlow['questions'][0]) => {
              // parse question options
              const options = _question.options.map((_option) => {
                return {
                  ..._option,
                  icon: strapiParser(_option.icon, 'icon'),
                  iconActive: strapiParser(_option.iconActive, 'iconActive'),
                  nextFlow: strapiParser(_option.nextFlow, 'nextFlow'),
                }
              });
              // return parsed options & nextFlow
              return {
                ..._question,
                id: parseInt(`${_question.id}`),
                options,
                otherwiseFlow: strapiParser(_question.otherwiseFlow, 'otherwiseFlow'),
              }
            });
            // return flow with parsed questions
            return {
              ...flow,
              questions
            }
          });
        }
      } catch (e) {
        console.log(e.message);
      }
    }
  }
});