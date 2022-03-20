import { defineStore } from 'pinia';
import { ImageFragment } from '~/types/graphql';
import { strapiParser } from '~~/services/helper';
import { IForm, IFormCategory, IFormCategoryFlow, IFormQuestion } from '~~/types/form';
import { useSubmissionStore } from './submission';

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
    // list of categories which have it's flows organized by flow order
    categories: [] as IFormCategory[],
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
    getStartQuestion: (state) => {
      return (categoryId: number): IFormQuestion => {
        return state.categories.find(category => category.id === categoryId)?.flows?.[0]?.flow?.questions?.[0]
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
    },
    getCurrentCategory: (state) => state.categories.find((c) => c.id === useSubmissionStore().submission?.category?.id),
  },
  actions: {
    // load form & categories metadata
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
                  categories (sort: "ordering:ASC", pagination:{pageSize: 50}) {
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
                        flows(pagination: {pageSize: 50}) {
                          flow {
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
                flows: category.attributes.flows.map(item => ({
                  flow: strapiParser(item.flow)
                })),
              }
            }),
          };
        }
      } catch (e) {
        console.log(e.message);
      }
    },
    // load all flows of the forms over all categories
    async loadFlows() {
      if (this.flows.length) return;
      const graphql = useStrapiGraphQL();
      const subDomain = useSubDomain();
      try {
        const { data } = await graphql(`
          ${ImageFragment}
          query FLOWS {
            formCategoryFlows(
              filters: {
                form: {subDomain: {eq : "${subDomain}"}}
              },
              pagination: {
                pageSize: 50
              }
            ) {
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
                  id: parseInt(`${_option.id}`),
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
                flowId: flow.id,
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
    },
    // initialize category tree, with ordered flows inside each category
    initCategories() {
      if (!this.form || !this.flows.length) return;
      this.categories = (this.form.categories as IFormCategory[]).map((category) => {
        return {
          ...category,
          flows: category.flows.map(item => ({
            flow: (this.flows as IFormCategoryFlow[]).find(f => f.id === item.flow.id),
          })),
        }
      });
    },
    getAllQuestions(): IFormQuestion[] {
      return this.getCurrentCategory?.flows.reduce((acc, item) => {
        return acc.concat(item?.flow?.questions || []);
      }, [] as IFormQuestion[]) || [];
    }
  }
});