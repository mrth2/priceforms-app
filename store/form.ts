import { defineStore } from 'pinia';
// import { ImageFragment, FlowFragment } from '~/types/graphql';
import { strapiParser } from '~~/services/helper';
import { IForm, IFormCategory, IFormCategoryFlow, IFormQuestion } from '~~/types/form';
import { useSubmissionStore } from './submission';
import { FlowQuery, MediaQuery } from '~~/types/rest';

const socialIcons = [{
  type: 'facebook',
  icon: 'facebook-f',
  prefix: 'fab',
}, {
  type: 'twitter',
  icon: 'twitter',
  prefix: 'fab',
}, {
  type: 'linkedin',
  icon: 'linkedin-in',
  prefix: 'fab',
}, {
  type: 'instagram',
  icon: 'instagram',
  prefix: 'fab',
}, {
  type: 'youtube',
  icon: 'youtube',
  prefix: 'fab',
}, {
  type: 'googleMap',
  icon: 'map-location-dot',
  prefix: 'fas',
}, {
  type: 'yelp',
  icon: 'yelp',
  prefix: 'fab',
}] as Array<{
  type: keyof IForm['socialLinks'],
  icon: string
  prefix: 'fab' | 'fas'
}>;

export const useFormStore = defineStore('form', {
  state: () => ({
    is404: false,
    form: null as IForm,
    flows: [] as IFormCategoryFlow[],
    // list of categories which have it's flows organized by flow order
    categories: [] as IFormCategory[],
    socialIcons,
  }),
  getters: {
    getTheme: (state) => state.form.theme,
    getHeaderStyle: (state) => state.form.headerStyle,
    getHomeStyle: (state) => /* state.form.homeStyle */'reviewRight',
    getSocialUrl: (state) => {
      return (type: keyof IForm['socialLinks']): string => state.form.socialLinks?.[type]
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
    getCurrentCategories: (state) => {
      const submissionStore = useSubmissionStore();
      return state.categories
        // sort out categories which are not in the submission
        .filter((c) => submissionStore.submission?.categories?.find(sc => sc.id === c.id))
        // reorder to get main category on top
        .sort((a, b) => {
          if (a.id === submissionStore.submission.category.id) return -1;
          if (b.id === submissionStore.submission.category.id) return 1;
          return 0;
        });
    },
  },
  actions: {
    // parse flow data from strapi
    parseFlow(_flow: IFormCategoryFlow) {
      // parse flow
      const flow = strapiParser(_flow) as IFormCategoryFlow;
      // parse category
      const category = strapiParser(flow.category, 'category') as IFormCategory;
      // parse flow questions
      const questions = flow.questions.map((_question: IFormCategoryFlow['questions'][0]) => {
        // parse question options
        const options = _question.options.map((_option) => {
          return {
            ..._option,
            id: parseInt(`${_option?.id}`),
            icon: strapiParser(_option?.icon, 'icon'),
            iconActive: strapiParser(_option?.iconActive, 'iconActive'),
            nextFlow: strapiParser(_option?.nextFlow, 'nextFlow'),
          }
        });
        // return parsed options & nextFlow
        return {
          ..._question,
          id: parseInt(`${_question?.id}`),
          options,
          otherwiseFlow: strapiParser(_question.otherwiseFlow, 'otherwiseFlow'),
          flowId: flow?.id,
          catId: category?.id,
        }
      });
      // return flow with parsed questions
      return {
        ...flow,
        category,
        questions
      }
    },
    // load main form integrated with current subdomain
    async loadFormRest() {
      if (this.form || this.is404) return;
      const params = {
        filters: {
          subDomain: {
            $eq: useSubDomain()
          }
        },
        fields: ['id', 'title', 'gtagId', 'hotjarId', 'theme', 'headerStyle', 'homeStyle', 'term', 'font', 'hasBack'],
        populate: {
          color: {
            fields: ['button', 'progress', 'primary']
          },
          introBanner: {
            fields: ['text', 'remoteVideo', 'autoplay'],
            populate: {
              media: MediaQuery
            }
          },
          thankyouBanner: {
            fields: ['text', 'remoteVideo', 'autoplay'],
            populate: {
              media: MediaQuery
            }
          },
          zipRestriction: '*',
          zip: '*',
          registerForm: {
            fields: ['title', 'description', 'progress', 'button'],
            populate: {
              placeholder: {
                fields: ['firstName', 'lastName', 'email', 'phone']
              }
            }
          },
          categoryForm: {
            fields: ['title', 'progress', 'hasNext', 'buttonOnTop']
          },
          socialLinks: {
            fields: ['facebook', 'instagram', 'twitter', 'youtube', 'linkedin']
          },
          footer: {
            fields: ['policy', 'sitemap', 'disclaimer', 'copyright']
          },
          logo: MediaQuery,
          favicon: MediaQuery,
          phone: {
            fields: ['label', 'number']
          },
          estimationPage: {
            fields: ['title', 'minimum', 'maximum', 'note']
          },
          thankyouPage: {
            fields: ['title', 'message', 'buttonReturn', 'returnLink', 'buttonPromo', 'promoLink']
          },
          reviews: {
            fields: ['id', 'name', 'message', 'rating', 'at'],
            populate: {
              avatar: MediaQuery
            },
            sort: ['ordering:ASC'],
          },
        }
      };
      try {
        const { data } = await useStrapiClient()<{ data: IForm[] }>('forms', { params });
        if (data?.length) {
          const form = strapiParser(data[0]) as IForm;
          this.form = {
            ...form,
            favicon: strapiParser(form.favicon, 'favicon'),
            logo: strapiParser(form.logo, 'logo'),
            introBanner: {
              ...form.introBanner,
              media: strapiParser(form.introBanner?.media)
            },
            thankyouBanner: {
              ...form.thankyouBanner,
              media: strapiParser(form.thankyouBanner?.media)
            },
            reviews: (form.reviews as any).data.map(item => {
              const parsedReview = strapiParser(item);
              return {
                ...parsedReview,
                avatar: strapiParser(item.attributes.avatar, 'avatar'),
              }
            }),
          };
        }
      } catch (e) {
        console.error(e);
      }
    },
    // load categories
    async loadCategoriesRest() {
      if (this.categories.length) return;
      const params = {
        filters: {
          form: {
            subDomain: {
              $eq: useSubDomain()
            }
          }
        },
        sort: ['ordering:ASC'],
        pagination: {
          pageSize: 50
        },
        fields: ['id', 'title'],
        populate: {
          icon: MediaQuery,
          iconActive: MediaQuery,
          flows: {
            populate: {
              flow: {
                fields: ['id']
              }
            },
            pagination: {
              pageSize: 50
            }
          }
        }
      };
      try {
        const { data } = await useStrapiClient()<{ data: any }>('form-categories', { params });
        if (data?.length) {
          this.categories = data.map((category) => {
            const parsedCategory = strapiParser(category);
            return {
              ...parsedCategory,
              icon: strapiParser(category.attributes.icon, 'icon'),
              iconActive: strapiParser(category.attributes.iconActive, 'iconActive'),
              flows: category.attributes.flows.map(item => ({
                flow: strapiParser(item.flow),
              })),
            }
          });
        }
      } catch (e) {
        console.error(e);
      }
    },
    // load all flows of the forms over all categories
    async loadFlowsRest() {
      if (this.flows.length || this.is404) return;
      const params = {
        filters: {
          form: {
            subDomain: {
              $eq: useSubDomain()
            }
          }
        },
        pagination: {
          page: 1,
          pageSize: 100
        },
        ...FlowQuery
      }
      try {
        const { data } = await useStrapiClient()<{ data: IFormCategoryFlow[] }>('form-category-flows', { params })
        this.flows = data.map(d => this.parseFlow(d)).sort((a, b) => a.id - b.id);
      } catch (e) {
        console.error(e);
      }
    },
    // load form & categories metadata
    /* async loadForm() {
      if (this.form || this.is404) return;
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
                  gtagId
                  introBanner {
                    media {
                      ...Image
                    }
                    text
                    remoteVideo
                    autoplay
                  }
                  thankyouBanner {
                    media {
                      ...Image
                    }
                    text
                    remoteVideo
                    autoplay
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
                    ... on ComponentPriceFormZipButton {
                      id
                      button
                    }
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
                    hasNext
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
                  estimationPage {
                    title
                    minimum
                    maximum
                    note
                  }
                  thankyouPage {
                    title
                    message
                    buttonReturn
                    returnLink
                    buttonPromo
                    promoLink
                  }
                  reviews (sort: "ordering:ASC") {
                    data {
                      id
                      attributes {
                        name
                        message
                        rating
                        at
                        avatar {
                          ...Image
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
          this.form = {
            ...form,
            favicon: strapiParser(form.favicon, 'favicon'),
            logo: strapiParser(form.logo, 'logo'),
            introBanner: {
              ...form.introBanner,
              media: strapiParser(form.introBanner?.media)
            },
            thankyouBanner: {
              ...form.thankyouBanner,
              media: strapiParser(form.thankyouBanner?.media)
            },
            reviews: (form.reviews as any).data.map(item => {
              const parsedReview = strapiParser(item);
              return {
                ...parsedReview,
                avatar: strapiParser(item.attributes.avatar, 'avatar'),
              }
            }),
          };
        }
      } catch (e) {
        console.log(e.message);
      }
    }, */
    // load categories
    /* async loadCategories() {
      if (this.categories.length) return;
      const graphql = useStrapiGraphQL();
      const subDomain = useSubDomain();
      try {
        const { data } = await graphql(`
          ${ImageFragment}
          query Categories {
            categories: formCategories (
              filters: {
                form: { subDomain: { eq: "${subDomain}" } }
              },
              sort: "ordering:ASC", 
              pagination: { pageSize: 50 }
            ) {
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
        `)
        if (data?.categories?.data?.length) {
          const categories = data.categories.data;
          this.categories = categories.map((category) => {
            const parsedCategory = strapiParser(category);
            return {
              ...parsedCategory,
              icon: strapiParser(category.attributes.icon, 'icon'),
              iconActive: strapiParser(category.attributes.iconActive, 'iconActive'),
              flows: category.attributes.flows.map(item => ({
                flow: strapiParser(item.flow)
              })),
            }
          });
        }
      } catch (e) {
        console.log(e.message);
      }
    }, */
    // load all flows of the forms over all categories
    /* async loadFlows() {
      if (this.flows.length || this.is404) return;
      const graphql = useStrapiGraphQL();
      const subDomain = useSubDomain();
      try {
        const { data } = await graphql(`
          ${ImageFragment}
          ${FlowFragment}
          query FLOWS {
            formCategoryFlows(
              filters: {
                form: {subDomain: {eq : "${subDomain}"}}
              },
              pagination: {
                pageSize: 100
              }
            ) {
              ...Flow
            }
          }
        `);
        if (data?.formCategoryFlows?.data?.length) {
          this.flows = data.formCategoryFlows.data.map((_flow) => this.parseFlow(_flow));
        }
      } catch (e) {
        console.log(e.message);
      }
    }, */
    // load flow by id
    /* async loadFlowById(id: number) {
      if (this.flows.find(f => f.id === id) || this.is404) return;
      const graphql = useStrapiGraphQL();
      try {
        const { data } = await graphql(`
          ${ImageFragment}
          ${FlowFragment}
          query FLOW {
            flow: formCategoryFlow (id: ${id}) {
              ...Flow
            }
          }
        `)
        if (data?.flow?.data) {
          const flow = this.parseFlow(data?.flow?.data);
          // push flow with parsed questions to list of flows
          this.flows.push(flow);
        }
      } catch (e) {
        console.log(e.message);
      }
    }, */
    // initialize category tree, with ordered flows inside each category
    initCategories() {
      if (!this.categories.length || !this.flows.length) return;
      this.categories = (this.categories as IFormCategory[]).map((category) => {
        return {
          ...category,
          flows: category.flows.map(item => ({
            flow: (this.flows as IFormCategoryFlow[]).find(f => f.id === item.flow.id),
          })),
        }
      });
    },
    getAllQuestions(): IFormQuestion[] {
      return (this.getCurrentCategories as IFormCategory[])
        .reduce((acc, category) => acc.concat(category.flows.map(item => item.flow)), [] as IFormCategoryFlow[])
        .reduce((acc, flow) => acc.concat(flow?.questions || []), [] as IFormQuestion[])
    },
    set404(flag: boolean) {
      this.is404 = flag;
    }
  }
});