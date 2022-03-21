import { IMedia } from "./media"
import { ISubscriber } from "./subscriber"
import { IUser } from "./user"

export interface IForm {
  id: number
  title: string
  subDomain: string
  introBanner: {
    text: string
    media: IMedia
  }
  thankyouBanner: {
    text: string
    media: IMedia
  }
  zip: Array<{
    hint?: string
    code?: string
    button: string
  }>
  term: string
  registerForm: {
    title: string
    description: string
    placeholder: {
      firstName: string
      lastName: string
      phone: string
      email: string
    }
    button: string
    progress: string
  }
  categoryForm: {
    title: string
    progress: string
  }
  categories: IFormCategory[]
  logo: IMedia
  favicon: IMedia
  theme: 'catania' | null
  homeStyle: 'reviewBottom' | 'reviewRight'
  headerStyle: 'logoLeft' | 'logoCenter'
  socialLinks: {
    facebook: string
    instagram: string
    twitter: string
    youtube: string
    linkedin: string
  }
  footer: {
    policy: string
    sitemap: string
    disclaimer: string
    copyright: string
  }
  phone: {
    label: string
    number: string
  }
  estimationPage: {
    title: string
    minimum: string
    maximum: string
    note: string
  }
  thankyouPage: {
    title: string
    message: string
    buttonReturn: string
    returnLink: string
    buttonPromo: string
    promoLink: string
  }
  reviews: Array<{
    id: number
    name: string
    avatar: IMedia
    message: string
    rating: number
    at: string
  }>
}

export interface IFormCategory {
  id: number
  title: string
  icon: IMedia
  iconActive: IMedia
  form: IForm
  flows: Array<{
    flow: IFormCategoryFlow
  }>
  createdAt: string
  updatedAt: string
}

export interface IFormPricing {
  minPrice: number
  maxPrice: number
  currency: 'usd' | 'gbp' | 'eur'
}

export interface IFormQuestionOption extends IFormPricing {
  id: number
  value: string
  icon: IMedia
  iconActive: IMedia
  discountPercent: number
  nextFlow: IFormCategoryFlow
}

export interface IFormQuestion {
  id: number
  title: string
  question: string
  type: 'yes_no' | 'yes_no_icon' | 'date_picker' | 'icon_list' | 'option_list' | 'image_list'
  description: string
  showEstimate: boolean
  hasNext: boolean
  nextButtonOnTop: boolean
  canSelectMulti: boolean
  options: IFormQuestionOption[]
  otherwiseFlow: IFormCategoryFlow
  // custom on front end only after load data
  flowId: IFormCategoryFlow['id']
}

export interface IFormCategoryFlow {
  id: number
  name: string
  questions: IFormQuestion[]
  form: IForm
  category: IFormCategory
}

export interface IFormSubmission extends IFormPricing {
  id: number
  zip: string
  owner: IUser
  subscriber: ISubscriber
  form: IForm
  category: IFormCategory
  status: 'register' | 'partial' | 'complete'
  progress: number
  stopAt: string
  data: Array<{
    fid: number
    qid: number
    oid?: number
    title: string
    question: string
    answer: string
    at: string
    order: number
    discount: number
  }>
  createdAt: string
  updatedAt: string
}

export type ISubmissionOption = IFormQuestionOption | Date | null;

export type ISubmissionEstimation = IFormPricing & { qid: number | null };
